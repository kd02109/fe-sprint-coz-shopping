import {
  Addon_TypesEnum,
  CHANNEL_CREATED,
  Channel,
  Provider,
  addons,
  dist_exports as dist_exports2,
  dist_exports2 as dist_exports3,
  dist_exports3 as dist_exports4,
  dist_exports4 as dist_exports5,
  dist_exports5 as dist_exports7,
  isJSON,
  mockChannel,
  parse,
  renderStorybookUI,
  require_lib,
  stringify,
} from "./chunk-YVXZQVGH.js";
import "./chunk-54KM6K5Z.js";
import { require_react_dom } from "./chunk-PUVLCKJJ.js";
import "./chunk-QPL63VNK.js";
import {
  dist_exports,
  dist_exports2 as dist_exports6,
  logger,
  pretty,
  scope,
} from "./chunk-F3MVQVF6.js";
import { require_react } from "./chunk-3FAXWWKG.js";
import "./chunk-FENICTK6.js";
import { __toESM } from "./chunk-AS2AMEUR.js";
var import_qs = __toESM(require_lib(), 1),
  { document, location } = scope,
  KEY = "storybook-channel",
  defaultEventOptions = { allowFunction: !0, maxDepth: 25 },
  PostmsgTransport = class {
    constructor(config) {
      if (
        ((this.config = config),
        (this.buffer = []),
        (this.handler = null),
        typeof scope?.addEventListener == "function" &&
          scope.addEventListener("message", this.handleEvent.bind(this), !1),
        config.page !== "manager" && config.page !== "preview")
      )
        throw new Error(
          `postmsg-channel: "config.page" cannot be "${config.page}"`
        );
    }
    setHandler(handler) {
      this.handler = (...args) => {
        handler.apply(this, args),
          !this.connected &&
            this.getLocalFrame().length &&
            (this.flush(), (this.connected = !0));
      };
    }
    send(event, options) {
      let {
          target,
          allowRegExp,
          allowFunction,
          allowSymbol,
          allowDate,
          allowUndefined,
          allowClass,
          maxDepth,
          space,
          lazyEval,
        } = options || {},
        eventOptions = Object.fromEntries(
          Object.entries({
            allowRegExp,
            allowFunction,
            allowSymbol,
            allowDate,
            allowUndefined,
            allowClass,
            maxDepth,
            space,
            lazyEval,
          }).filter(([k, v]) => typeof v < "u")
        ),
        stringifyOptions = {
          ...defaultEventOptions,
          ...(scope.CHANNEL_OPTIONS || {}),
          ...eventOptions,
        },
        frames = this.getFrames(target),
        query = import_qs.default.parse(location.search, {
          ignoreQueryPrefix: !0,
        }),
        data = stringify(
          { key: KEY, event, refId: query.refId },
          stringifyOptions
        );
      return frames.length
        ? (this.buffer.length && this.flush(),
          frames.forEach((f) => {
            try {
              f.postMessage(data, "*");
            } catch {
              console.error("sending over postmessage fail");
            }
          }),
          Promise.resolve(null))
        : new Promise((resolve, reject) => {
            this.buffer.push({ event, resolve, reject });
          });
    }
    flush() {
      let { buffer } = this;
      (this.buffer = []),
        buffer.forEach((item) => {
          this.send(item.event).then(item.resolve).catch(item.reject);
        });
    }
    getFrames(target) {
      if (this.config.page === "manager") {
        let list = Array.from(
          document.querySelectorAll("iframe[data-is-storybook][data-is-loaded]")
        )
          .filter((e) => {
            try {
              return (
                !!e.contentWindow &&
                e.dataset.isStorybook !== void 0 &&
                e.id === target
              );
            } catch {
              return !1;
            }
          })
          .map((e) => e.contentWindow);
        return list.length ? list : this.getCurrentFrames();
      }
      return scope && scope.parent && scope.parent !== scope.self
        ? [scope.parent]
        : [];
    }
    getCurrentFrames() {
      return this.config.page === "manager"
        ? Array.from(
            document.querySelectorAll('[data-is-storybook="true"]')
          ).map((e) => e.contentWindow)
        : scope && scope.parent
        ? [scope.parent]
        : [];
    }
    getLocalFrame() {
      return this.config.page === "manager"
        ? Array.from(
            document.querySelectorAll("#storybook-preview-iframe")
          ).map((e) => e.contentWindow)
        : scope && scope.parent
        ? [scope.parent]
        : [];
    }
    handleEvent(rawEvent) {
      try {
        let { data } = rawEvent,
          { key, event, refId } =
            typeof data == "string" && isJSON(data)
              ? parse(data, scope.CHANNEL_OPTIONS || {})
              : data;
        if (key === KEY) {
          let pageString =
              this.config.page === "manager"
                ? '<span style="color: #37D5D3; background: black"> manager </span>'
                : '<span style="color: #1EA7FD; background: black"> preview </span>',
            eventString = Object.values(dist_exports3).includes(event.type)
              ? `<span style="color: #FF4785">${event.type}</span>`
              : `<span style="color: #FFAE00">${event.type}</span>`;
          if (
            (refId && (event.refId = refId),
            (event.source =
              this.config.page === "preview"
                ? rawEvent.origin
                : getEventSourceUrl(rawEvent)),
            !event.source)
          ) {
            pretty.error(
              `${pageString} received ${eventString} but was unable to determine the source of the event`
            );
            return;
          }
          let message = `${pageString} received ${eventString} (${data.length})`;
          pretty.debug(
            location.origin !== event.source
              ? message
              : `${message} <span style="color: gray">(on ${location.origin} from ${event.source})</span>`,
            ...event.args
          ),
            this.handler(event);
        }
      } catch (error) {
        logger.error(error);
      }
    }
  },
  getEventSourceUrl = (event) => {
    let frames = Array.from(
        document.querySelectorAll("iframe[data-is-storybook]")
      ),
      [frame, ...remainder] = frames.filter((element) => {
        try {
          return element.contentWindow === event.source;
        } catch {}
        let src = element.getAttribute("src"),
          origin;
        try {
          ({ origin } = new URL(src, document.location.toString()));
        } catch {
          return !1;
        }
        return origin === event.origin;
      });
    if (frame && remainder.length === 0) {
      let src = frame.getAttribute("src"),
        { protocol, host, pathname } = new URL(
          src,
          document.location.toString()
        );
      return `${protocol}//${host}${pathname}`;
    }
    return (
      remainder.length > 0 &&
        logger.error("found multiple candidates for event source"),
      null
    );
  };
function createChannel({ page }) {
  let transport = new PostmsgTransport({ page });
  return new Channel({ transport });
}
var { WebSocket } = scope,
  WebsocketTransport = class {
    constructor({ url, onError }) {
      (this.buffer = []), (this.isReady = !1), this.connect(url, onError);
    }
    setHandler(handler) {
      this.handler = handler;
    }
    send(event) {
      this.isReady ? this.sendNow(event) : this.sendLater(event);
    }
    sendLater(event) {
      this.buffer.push(event);
    }
    sendNow(event) {
      let data = stringify(event, { maxDepth: 15, allowFunction: !0 });
      this.socket.send(data);
    }
    flush() {
      let { buffer } = this;
      (this.buffer = []), buffer.forEach((event) => this.send(event));
    }
    connect(url, onError) {
      (this.socket = new WebSocket(url)),
        (this.socket.onopen = () => {
          (this.isReady = !0), this.flush();
        }),
        (this.socket.onmessage = ({ data }) => {
          let event =
            typeof data == "string" && isJSON(data) ? parse(data) : data;
          this.handler(event);
        }),
        (this.socket.onerror = (e) => {
          onError && onError(e);
        });
    }
  };
function createChannel2({
  url,
  async = !1,
  onError = (err) => logger.warn(err),
}) {
  let channelUrl = url;
  if (!channelUrl) {
    let protocol = window.location.protocol === "http:" ? "ws" : "wss",
      { hostname, port } = window.location;
    channelUrl = `${protocol}://${hostname}:${port}/storybook-server-channel`;
  }
  let transport = new WebsocketTransport({ url: channelUrl, onError });
  return new Channel({ transport, async });
}
var REACT = __toESM(require_react()),
  REACTDOM = __toESM(require_react_dom());
var values = {
  react: REACT,
  "react-dom": REACTDOM,
  "@storybook/components": dist_exports7,
  "@storybook/channels": dist_exports4,
  "@storybook/core-events": dist_exports3,
  "@storybook/router": dist_exports2,
  "@storybook/theming": dist_exports6,
  "@storybook/api": dist_exports5,
  "@storybook/manager-api": dist_exports5,
  "@storybook/addons": { addons, types: Addon_TypesEnum, mockChannel },
  "@storybook/client-logger": dist_exports,
};
var Keys = ((Keys2) => (
  (Keys2.react = "__REACT__"),
  (Keys2["react-dom"] = "__REACTDOM__"),
  (Keys2["@storybook/components"] = "__STORYBOOKCOMPONENTS__"),
  (Keys2["@storybook/channels"] = "__STORYBOOKCHANNELS__"),
  (Keys2["@storybook/core-events"] = "__STORYBOOKCOREEVENTS__"),
  (Keys2["@storybook/router"] = "__STORYBOOKROUTER__"),
  (Keys2["@storybook/theming"] = "__STORYBOOKTHEMING__"),
  (Keys2["@storybook/api"] = "__STORYBOOKAPI__"),
  (Keys2["@storybook/manager-api"] = "__STORYBOOKAPI__"),
  (Keys2["@storybook/addons"] = "__STORYBOOKADDONS__"),
  (Keys2["@storybook/client-logger"] = "__STORYBOOKCLIENTLOGGER__"),
  Keys2
))(Keys || {});
var { FEATURES, CONFIG_TYPE } = scope,
  ReactProvider = class extends Provider {
    constructor() {
      super();
      let postMessageChannel = createChannel({ page: "manager" });
      if (
        (addons.setChannel(postMessageChannel),
        postMessageChannel.emit(CHANNEL_CREATED),
        (this.addons = addons),
        (this.channel = postMessageChannel),
        FEATURES?.storyStoreV7 && CONFIG_TYPE === "DEVELOPMENT")
      ) {
        let serverChannel = createChannel2({});
        (this.serverChannel = serverChannel),
          addons.setServerChannel(this.serverChannel);
      }
    }
    getElements(type) {
      return this.addons.getElements(type);
    }
    getConfig() {
      return this.addons.getConfig();
    }
    handleAPI(api) {
      this.addons.loadAddons(api);
    }
  },
  { document: document2 } = scope,
  rootEl = document2.getElementById("root");
renderStorybookUI(rootEl, new ReactProvider());
Object.keys(Keys).forEach((key) => {
  scope[Keys[key]] = values[key];
});
