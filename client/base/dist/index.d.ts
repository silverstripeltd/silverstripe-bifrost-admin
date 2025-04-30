import * as React from 'react';
import * as ReactRouter from 'react-router';

/**
 * Defines the API accessible from pilets.
 */
export interface PiletApi extends EventEmitter, PiletCustomApi, PiletCoreApi {
  /**
   * Gets the metadata of the current pilet.
   */
  meta: PiletMetadata;
}

/**
 * The emitter for Piral app shell events.
 */
export interface EventEmitter {
  /**
   * Attaches a new event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  on<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Attaches a new event listener that is removed once the event fired.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  once<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Detaches an existing event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  off<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Emits a new event with the given type.
   * @param type The type of the event to emit.
   * @param arg The payload of the event.
   */
  emit<K extends keyof PiralEventMap>(type: K, arg: PiralEventMap[K]): EventEmitter;
}

/**
 * Custom Pilet API parts defined outside of piral-core.
 */
export interface PiletCustomApi extends PiletLocaleApi, PiletDashboardApi, PiletMenuApi, PiletNotificationsApi, PiletModalsApi, PiletFeedsApi {}

/**
 * Defines the Pilet API from piral-core.
 * This interface will be consumed by pilet developers so that their pilet can interact with the piral instance.
 */
export interface PiletCoreApi {
  /**
   * Gets a shared data value.
   * @param name The name of the data to retrieve.
   */
  getData<TKey extends string>(name: TKey): SharedData[TKey];
  /**
   * Sets the data using a given name. The name needs to be used exclusively by the current pilet.
   * Using the name occupied by another pilet will result in no change.
   * @param name The name of the data to store.
   * @param value The value of the data to store.
   * @param options The optional configuration for storing this piece of data.
   * @returns True if the data could be set, otherwise false.
   */
  setData<TKey extends string>(name: TKey, value: SharedData[TKey], options?: DataStoreOptions): boolean;
  /**
   * Registers a route for predefined page component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param Component The component to render the page.
   * @param meta The optional metadata to use.
   */
  registerPage(route: string, Component: AnyComponent<PageComponentProps>, meta?: PiralPageMeta): RegistrationDisposer;
  /**
   * Unregisters the page identified by the given route.
   * @param route The route that was previously registered.
   */
  unregisterPage(route: string): void;
  /**
   * Registers an extension component with a predefined extension component.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param Component The component to be rendered.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtension<TName>(name: TName extends string ? TName : string, Component: AnyExtensionComponent<TName>, defaults?: Partial<ExtensionParams<TName>>): RegistrationDisposer;
  /**
   * Unregisters a global extension component.
   * Only previously registered extension components can be unregistered.
   * @param name The name of the extension slot to unregister from.
   * @param Component The registered extension component to unregister.
   */
  unregisterExtension<TName>(name: TName extends string ? TName : string, Component: AnyExtensionComponent<TName>): void;
  /**
   * React component for displaying extensions for a given name.
   * @param props The extension's rendering props.
   * @return The created React element.
   */
  Extension<TName>(props: ExtensionSlotProps<TName>): React.ReactElement | null;
  /**
   * Renders an extension in a plain DOM component.
   * @param element The DOM element or shadow root as a container for rendering the extension.
   * @param props The extension's rendering props.
   * @return The disposer to clear the extension.
   */
  renderHtmlExtension<TName>(element: HTMLElement | ShadowRoot, props: ExtensionSlotProps<TName>): Disposable;
}

/**
 * Describes the metadata of a pilet available in its API.
 */
export interface PiletMetadata {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: string;
  /**
   * Provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally indicates the global require reference, if any.
   */
  requireRef?: string;
  /**
   * Additional shared dependencies from the pilet.
   */
  dependencies: Record<string, string>;
  /**
   * Provides some configuration to be used in the pilet.
   */
  config: Record<string, any>;
  /**
   * The URL of the main script of the pilet.
   */
  link: string;
  /**
   * The base path to the pilet. Can be used to make resource requests
   * and override the public path.
   */
  basePath: string;
}

/**
 * Listener for Piral app shell events.
 */
export interface Listener<T> {
  /**
   * Receives an event of type T.
   */
  (arg: T): void;
}

/**
 * The map of known Piral app shell events.
 */
export interface PiralEventMap extends PiralCustomEventMap {
  "unload-pilet": PiralUnloadPiletEvent;
  [custom: string]: any;
  "store-data": PiralStoreDataEvent;
  "unhandled-error": PiralUnhandledErrorEvent;
  "loading-pilets": PiralLoadingPiletsEvent;
  "loaded-pilets": PiralLoadedPiletsEvent;
}

export interface PiletLocaleApi {
  /**
   * Adds a list of translations to the existing translations.
   * 
   * Internally, setTranslations is used, which means the translations will be exclusively used for
   * retrieving translations for the pilet.
   * @param messagesList The list of messages that extend the existing translations
   * @param isOverriding Indicates whether the new translations overwrite the existing translations
   */
  addTranslations(messagesList: Array<AnyLocalizationMessages>, isOverriding?: boolean): void;
  /**
   * Gets the currently selected language directly.
   */
  getCurrentLanguage(): string;
  /**
   * Gets the currently selected language in a callback that is also invoked when the
   * selected language changes. Returns a disposable to stop the notifications.
   */
  getCurrentLanguage(cb: (currently: string) => void): Disposable;
  /**
   * Translates the given tag (using the optional variables) into a string using the current language.
   * The used template can contain placeholders in form of `{{variableName}}`.
   * @param tag The tag to translate.
   * @param variables The optional variables to fill into the temnplate.
   */
  translate<T extends object = Record<string, string>>(tag: string, variables?: T): string;
  /**
   * Provides translations to the application.
   * The translations will be exclusively used for retrieving translations for the pilet.
   * @param messages The messages to use as translation basis.
   */
  setTranslations(messages: AnyLocalizationMessages): void;
  /**
   * Gets the currently provided translations by the pilet.
   */
  getTranslations(): LocalizationMessages;
}

export interface PiletDashboardApi {
  /**
   * Registers a tile with a predefined tile components.
   * The name has to be unique within the current pilet.
   * @param name The name of the tile.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(name: string, Component: AnyComponent<TileComponentProps>, preferences?: TilePreferences): RegistrationDisposer;
  /**
   * Registers a tile for predefined tile components.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(Component: AnyComponent<TileComponentProps>, preferences?: TilePreferences): RegistrationDisposer;
  /**
   * Unregisters a tile known by the given name.
   * Only previously registered tiles can be unregistered.
   * @param name The name of the tile to unregister.
   */
  unregisterTile(name: string): void;
}

export interface PiletMenuApi {
  /**
   * Registers a menu item for a predefined menu component.
   * The name has to be unique within the current pilet.
   * @param name The name of the menu item.
   * @param Component The component to be rendered within the menu.
   * @param settings The optional configuration for the menu item.
   */
  registerMenu(name: string, Component: AnyComponent<MenuComponentProps>, settings?: MenuSettings): RegistrationDisposer;
  /**
   * Registers a menu item for a predefined menu component.
   * @param Component The component to be rendered within the menu.
   * @param settings The optional configuration for the menu item.
   */
  registerMenu(Component: AnyComponent<MenuComponentProps>, settings?: MenuSettings): RegistrationDisposer;
  /**
   * Unregisters a menu item known by the given name.
   * Only previously registered menu items can be unregistered.
   * @param name The name of the menu item to unregister.
   */
  unregisterMenu(name: string): void;
}

export interface PiletNotificationsApi {
  /**
   * Shows a notification in the determined spot using the provided content.
   * @param content The content to display. Normally, a string would be sufficient.
   * @param options The options to consider for showing the notification.
   * @returns A callback to trigger closing the notification.
   */
  showNotification(content: string | React.ReactElement<any, any> | AnyComponent<NotificationComponentProps>, options?: NotificationOptions): Disposable;
}

export interface PiletModalsApi {
  /**
   * Shows a modal dialog with the given name.
   * The modal can be optionally programmatically closed using the returned callback.
   * @param name The name of the registered modal.
   * @param options Optional arguments for creating the modal.
   * @returns A callback to trigger closing the modal.
   */
  showModal<T>(name: T extends string ? T : string, options?: ModalOptions<T>): Disposable;
  /**
   * Registers a modal dialog using a React component.
   * The name needs to be unique to be used without the pilet's name.
   * @param name The name of the modal to register.
   * @param Component The component to render the page.
   * @param defaults Optionally, sets the default values for the inserted options.
   * @param layout Optionally, sets the layout options for the dialog wrapper.
   */
  registerModal<T>(name: T extends string ? T : string, Component: AnyComponent<ModalComponentProps<T>>, defaults?: ModalOptions<T>, layout?: ModalLayoutOptions): RegistrationDisposer;
  /**
   * Unregisters a modal by its name.
   * @param name The name that was previously registered.
   */
  unregisterModal<T>(name: T extends string ? T : string): void;
}

export interface PiletFeedsApi {
  /**
   * Creates a connector for wrapping components with data relations.
   * @param resolver The resolver for the initial data set.
   */
  createConnector<T>(resolver: FeedResolver<T>): FeedConnector<T>;
  /**
   * Creates a connector for wrapping components with data relations.
   * @param options The options for creating the connector.
   */
  createConnector<TData, TItem, TReducers extends FeedConnectorReducers<TData>>(options: FeedConnectorOptions<TData, TItem, TReducers>): FeedConnector<TData, TReducers>;
}

/**
 * Defines the shape of the data store for storing shared data.
 */
export interface SharedData<TValue = any> {
  [key: string]: TValue;
}

/**
 * Defines the options to be used for storing data.
 */
export type DataStoreOptions = DataStoreTarget | CustomDataStoreOptions;

/**
 * Possible shapes for a component.
 */
export type AnyComponent<T> = React.ComponentType<T> | FirstParametersOf<ComponentConverters<T>>;

/**
 * The props used by a page component.
 */
export interface PageComponentProps<T extends {
  [K in keyof T]?: string;
} = {}, S = any> extends RouteBaseProps<T, S> {
  /**
   * The meta data registered with the page.
   */
  meta: PiralPageMeta;
  /**
   * The children of the page.
   */
  children: React.ReactNode;
}

/**
 * The meta data registered for a page.
 */
export interface PiralPageMeta extends PiralCustomPageMeta {}

/**
 * The shape of an implicit unregister function.
 */
export interface RegistrationDisposer {
  /**
   * Cleans up the previous registration.
   */
  (): void;
}

/**
 * Shorthand for the definition of an extension component.
 */
export type AnyExtensionComponent<TName> = TName extends keyof PiralExtensionSlotMap ? AnyComponent<ExtensionComponentProps<TName>> : TName extends string ? AnyComponent<ExtensionComponentProps<any>> : AnyComponent<ExtensionComponentProps<TName>>;

/**
 * Make all properties in T optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Gives the extension params shape for the given extension slot name.
 */
export type ExtensionParams<TName> = TName extends keyof PiralExtensionSlotMap ? PiralExtensionSlotMap[TName] : TName extends string ? any : TName;

/**
 * The props for defining an extension slot.
 */
export type ExtensionSlotProps<TName = string> = BaseExtensionSlotProps<TName extends string ? TName : string, ExtensionParams<TName>>;

/**
 * Any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it.
 * 
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement)
 */
export const HTMLElement: {
  prototype: HTMLElement;
  new (): HTMLElement;
};

/**
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ShadowRoot)
 */
export const ShadowRoot: {
  prototype: ShadowRoot;
  new (): ShadowRoot;
};

/**
 * Can be implemented by functions to be used for disposal purposes.
 */
export interface Disposable {
  /**
   * Disposes the created resource.
   */
  (): void;
}

/**
 * Construct a type with a set of properties K of type T
 */
export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

/**
 * Custom events defined outside of piral-core.
 */
export interface PiralCustomEventMap {
  "select-language": PiralSelectLanguageEvent;
}

/**
 * Gets fired when a pilet gets unloaded.
 */
export interface PiralUnloadPiletEvent {
  /**
   * The name of the pilet to be unloaded.
   */
  name: string;
}

/**
 * Gets fired when a data item gets stored in piral.
 */
export interface PiralStoreDataEvent<TValue = any> {
  /**
   * The name of the item that was stored.
   */
  name: string;
  /**
   * The storage target of the item.
   */
  target: string;
  /**
   * The value that was stored.
   */
  value: TValue;
  /**
   * The owner of the item.
   */
  owner: string;
  /**
   * The expiration of the item.
   */
  expires: number;
}

/**
 * Gets fired when an unhandled error in a component has been prevented.
 */
export interface PiralUnhandledErrorEvent {
  /**
   * The container showing the error / containing the component.
   */
  container: any;
  /**
   * The type of the error, i.e., the type of component that crashed.
   */
  errorType: string;
  /**
   * The actual error that was emitted.
   */
  error: Error;
  /**
   * The name of the pilet containing the problematic component.
   */
  pilet: string;
}

/**
 * Gets fired when the loading of pilets is triggered.
 */
export interface PiralLoadingPiletsEvent {
  /**
   * The options that have been supplied for loading the pilets.
   */
  options: LoadPiletsOptions;
}

/**
 * Gets fired when all pilets have been loaded.
 */
export interface PiralLoadedPiletsEvent {
  /**
   * The pilets that have been loaded.
   */
  pilets: Array<Pilet>;
  /**
   * The loading error, if any.
   */
  error?: Error;
}

export const Array: ArrayConstructor;

export type AnyLocalizationMessages = LocalizationMessages | NestedLocalizationMessages;

export interface LocalizationMessages {
  [lang: string]: Translations;
}

export type TileComponentProps = BaseComponentProps & BareTileComponentProps;

export interface TilePreferences extends PiralCustomTilePreferences {
  /**
   * Sets the desired initial number of columns.
   * This may be overridden either by the user (if resizable true), or by the dashboard.
   */
  initialColumns?: number;
  /**
   * Sets the desired initial number of rows.
   * This may be overridden either by the user (if resizable true), or by the dashboard.
   */
  initialRows?: number;
  /**
   * Determines if the tile can be resized by the user.
   * By default the size of the tile is fixed.
   */
  resizable?: boolean;
  /**
   * Declares a set of custom properties to be used with user-specified values.
   */
  customProperties?: Array<string>;
}

export interface MenuComponentProps extends BaseComponentProps {}

export type MenuSettings = PiralCustomMenuSettings & PiralSpecificMenuSettings;

export type NotificationComponentProps = BaseComponentProps & BareNotificationProps;

export type NotificationOptions = PiralCustomNotificationOptions & PiralStandardNotificationOptions & PiralSpecificNotificationOptions;

export type ModalOptions<T> = T extends keyof PiralModalsMap ? PiralModalsMap[T] & BaseModalOptions : T extends string ? BaseModalOptions : T;

export type ModalComponentProps<T> = BaseComponentProps & BareModalComponentProps<ModalOptions<T>>;

/**
 * The options provided for the dialog layout.
 */
export interface ModalLayoutOptions {}

export interface FeedResolver<TData> {
  /**
   * Function to derive the initial set of data.
   * @returns The promise for retrieving the initial data set.
   */
  (): Promise<TData>;
}

export type FeedConnector<TData, TReducers = {}> = GetActions<TReducers> & {
  /**
   * Connector function for wrapping a component.
   * @param component The component to connect by providing a data prop.
   */
  <TProps>(component: React.ComponentType<TProps & FeedConnectorProps<TData>>): React.FC<TProps>;
  /**
   * Invalidates the underlying feed connector.
   * Forces a reload on next use.
   */
  invalidate(): void;
};

export interface FeedConnectorOptions<TData, TItem, TReducers extends FeedConnectorReducers<TData> = {}> {
  /**
   * Function to derive the initial set of data.
   * @returns The promise for retrieving the initial data set.
   */
  initialize: FeedResolver<TData>;
  /**
   * Function to be called for connecting to a live data feed.
   * @param callback The function to call when an item updated.
   * @returns A callback for disconnecting from the feed.
   */
  connect?: FeedSubscriber<TItem>;
  /**
   * Function to be called when some data updated.
   * @param data The current set of data.
   * @param item The updated item to include.
   * @returns The promise for retrieving the updated data set or the updated data set.
   */
  update?: FeedReducer<TData, TItem>;
  /**
   * Defines the optional reducers for modifying the data state.
   */
  reducers?: TReducers;
  /**
   * Optional flag to avoid lazy loading and initialize the data directly.
   */
  immediately?: boolean;
}

export interface FeedConnectorReducers<TData> {
  [name: string]: (data: TData, ...args: any) => Promise<TData> | TData;
}

/**
 * Defines the potential targets when storing data.
 */
export type DataStoreTarget = "memory" | "local" | "remote";

/**
 * Defines the custom options for storing data.
 */
export interface CustomDataStoreOptions {
  /**
   * The target data store. By default the data is only stored in memory.
   */
  target?: DataStoreTarget;
  /**
   * Optionally determines when the data expires.
   */
  expires?: "never" | Date | number;
}

export type FirstParametersOf<T> = {
  [K in keyof T]: T[K] extends (arg: any) => any ? FirstParameter<T[K]> : never;
}[keyof T];

/**
 * Mapping of available component converters.
 */
export interface ComponentConverters<TProps> extends PiralCustomComponentConverters<TProps> {
  /**
   * Converts the HTML component to a framework-independent component.
   * @param component The vanilla JavaScript component to be converted.
   */
  html(component: HtmlComponent<TProps>): ForeignComponent<TProps>;
}

/**
 * The props that every registered page component obtains.
 */
export interface RouteBaseProps<UrlParams extends {
  [K in keyof UrlParams]?: string;
} = {}, UrlState = any> extends ReactRouter.RouteComponentProps<UrlParams, {}, UrlState>, BaseComponentProps {}

/**
 * Custom meta data to include for pages.
 */
export interface PiralCustomPageMeta {}

/**
 * The props of an extension component.
 */
export interface ExtensionComponentProps<T> extends BaseComponentProps {
  /**
   * The provided parameters for showing the extension.
   */
  params: T extends keyof PiralExtensionSlotMap ? PiralExtensionSlotMap[T] : T extends string ? any : T;
  /**
   * The optional children to receive, if any.
   */
  children?: React.ReactNode;
}

/**
 * The mapping of the existing (known) extension slots.
 */
export interface PiralExtensionSlotMap extends PiralCustomExtensionSlotMap {}

/**
 * The basic props for defining an extension slot.
 */
export interface BaseExtensionSlotProps<TName, TParams> {
  /**
   * The children to transport, if any.
   */
  children?: React.ReactNode;
  /**
   * Defines what should be rendered when no components are available
   * for the specified extension.
   */
  empty?(props: TParams): React.ReactNode;
  /**
   * Determines if the `render` function should be called in case no
   * components are available for the specified extension.
   * 
   * If true, `empty` will be called and returned from the slot.
   * If false, `render` will be called with the result of calling `empty`.
   * The result of calling `render` will then be returned from the slot.
   */
  emptySkipsRender?: boolean;
  /**
   * Defines the order of the components to render.
   * May be more convient than using `render` w.r.t. ordering extensions
   * by their supplied metadata.
   * @param extensions The registered extensions.
   * @returns The ordered extensions.
   */
  order?(extensions: Array<ExtensionRegistration>): Array<ExtensionRegistration>;
  /**
   * Defines how the provided nodes should be rendered.
   * @param nodes The rendered extension nodes.
   * @returns The rendered nodes, i.e., an ReactElement.
   */
  render?(nodes: Array<React.ReactNode>): React.ReactElement<any, any> | null;
  /**
   * The custom parameters for the given extension.
   */
  params?: TParams;
  /**
   * The name of the extension to render.
   */
  name: TName;
}

export interface PiralSelectLanguageEvent {
  /**
   * Gets the previously selected language.
   */
  previousLanguage: string;
  /**
   * Gets the currently selected language.
   */
  currentLanguage: string;
}

export const Error: ErrorConstructor;

/**
 * The options for loading pilets.
 */
export interface LoadPiletsOptions {
  /**
   * The callback function for creating an API object.
   * The API object is passed on to a specific pilet.
   */
  createApi: PiletApiCreator;
  /**
   * The callback for fetching the dynamic pilets.
   */
  fetchPilets: PiletRequester;
  /**
   * Optionally, some already existing evaluated pilets, e.g.,
   * helpful when debugging or in SSR scenarios.
   */
  pilets?: Array<Pilet>;
  /**
   * Optionally, configures the default loader.
   */
  config?: DefaultLoaderConfig;
  /**
   * Optionally, defines the default way how to load a pilet.
   */
  loadPilet?: PiletLoader;
  /**
   * Optionally, defines loaders for custom specifications.
   */
  loaders?: CustomSpecLoaders;
  /**
   * Optionally, defines a set of loading hooks to be used.
   */
  hooks?: PiletLifecycleHooks;
  /**
   * Gets the map of globally available dependencies with their names
   * as keys and their evaluated pilet content as value.
   */
  dependencies?: AvailableDependencies;
  /**
   * Optionally, defines the loading strategy to use.
   */
  strategy?: PiletLoadingStrategy;
}

/**
 * An evaluated pilet, i.e., a full pilet: functionality and metadata.
 */
export type Pilet = SinglePilet | MultiPilet;

export interface ArrayConstructor {
  new (arrayLength?: number): Array<any>;
  (arrayLength?: number): Array<any>;
  <T>(arrayLength: number): Array<T>;
  <T>(...items: Array<T>): Array<T>;
  isArray(arg: any): arg is Array<any>;
  readonly prototype: Array<any>;
  /**
   * Creates an array from an array-like object.
   * @param arrayLike An array-like object to convert to an array.
   */
  from<T>(arrayLike: ArrayLike<T>): Array<T>;
  /**
   * Creates an array from an iterable object.
   * @param arrayLike An array-like object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
  /**
   * Returns a new array from a set of elements.
   * @param items A set of elements to include in the new array object.
   */
  of<T>(...items: Array<T>): Array<T>;
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   */
  from<T>(iterable: Iterable<T> | ArrayLike<T>): Array<T>;
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
  readonly [Symbol.species]: ArrayConstructor;
}

export interface NestedLocalizationMessages {
  [lang: string]: NestedTranslations;
}

export interface Translations {
  [tag: string]: string;
}

/**
 * The props that every registered component obtains.
 */
export interface BaseComponentProps {
  /**
   * The currently used pilet API.
   */
  piral: PiletApi;
}

export interface BareTileComponentProps {
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
}

export interface PiralCustomTilePreferences {}

export interface PiralCustomMenuSettings {}

export type PiralSpecificMenuSettings = UnionOf<{
  [P in keyof PiralMenuType]: Partial<PiralMenuType[P]> & {
    /**
     * The type of the menu used.
     */
    type?: P;
  };
}>;

export interface BareNotificationProps {
  /**
   * Callback for closing the notification programmatically.
   */
  onClose(): void;
  /**
   * Provides the passed in options for this particular notification.
   */
  options: NotificationOptions;
}

export interface PiralCustomNotificationOptions {}

export interface PiralStandardNotificationOptions {
  /**
   * The title of the notification, if any.
   */
  title?: string;
  /**
   * Determines when the notification should automatically close in milliseconds.
   * A value of 0 or undefined forces the user to close the notification.
   */
  autoClose?: number;
}

export type PiralSpecificNotificationOptions = UnionOf<{
  [P in keyof PiralNotificationTypes]: Partial<PiralNotificationTypes[P]> & {
    /**
     * The type of the notification used when displaying the message.
     * By default info is used.
     */
    type?: P;
  };
}>;

export interface BaseModalOptions {}

export interface PiralModalsMap extends PiralCustomModalsMap {}

export interface BareModalComponentProps<TOpts> {
  /**
   * Callback for closing the modal programmatically.
   */
  onClose(): void;
  /**
   * Provides the passed in options for this particular modal.
   */
  options?: TOpts;
}

export const Promise: PromiseConstructor;

export type GetActions<TReducers> = {
  [P in keyof TReducers]: (...args: RemainingArgs<TReducers[P]>) => void;
};

export interface FeedConnectorProps<TData> {
  /**
   * The current data from the feed.
   */
  data: TData;
}

export interface FeedSubscriber<TItem> {
  (callback: (value: TItem) => void): Disposable;
}

export interface FeedReducer<TData, TAction> {
  (data: TData, item: TAction): Promise<TData> | TData;
}

/**
 * Enables basic storage and retrieval of dates and times.
 */
export const Date: DateConstructor;

export type FirstParameter<T extends (arg: any) => any> = T extends (arg: infer P) => any ? P : never;

/**
 * Custom component converters defined outside of piral-core.
 */
export interface PiralCustomComponentConverters<TProps> {}

/**
 * Definition of a vanilla JavaScript component.
 */
export interface HtmlComponent<TProps> {
  /**
   * Renders a component into the provided element using the given props and context.
   */
  component: ForeignComponent<TProps>;
  /**
   * The type of the HTML component.
   */
  type: "html";
}

/**
 * Generic definition of a framework-independent component.
 */
export interface ForeignComponent<TProps> {
  /**
   * Called when the component is mounted.
   * @param element The container hosting the element.
   * @param props The props to transport.
   * @param ctx The associated context.
   * @param locals The local state of this component instance.
   */
  mount(element: HTMLElement, props: TProps, ctx: ComponentContext, locals: Record<string, any>): void;
  /**
   * Called when the component should be updated.
   * @param element The container hosting the element.
   * @param props The props to transport.
   * @param ctx The associated context.
   * @param locals The local state of this component instance.
   */
  update?(element: HTMLElement, props: TProps, ctx: ComponentContext, locals: Record<string, any>): void;
  /**
   * Called when a component is unmounted.
   * @param element The container that was hosting the element.
   * @param locals The local state of this component instance.
   */
  unmount?(element: HTMLElement, locals: Record<string, any>): void;
}

/**
 * Custom extension slots outside of piral-core.
 */
export interface PiralCustomExtensionSlotMap {}

/**
 * The interface modeling the registration of a pilet extension component.
 */
export interface ExtensionRegistration extends BaseRegistration {
  /**
   * The wrapped registered extension component.
   */
  component: WrappedComponent<ExtensionComponentProps<string>>;
  /**
   * The original extension component that has been registered.
   */
  reference: any;
  /**
   * The default params (i.e., meta) of the extension.
   */
  defaults: any;
}

export interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
  /**
   * Create .stack property on a target object
   */
  captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  /**
   * Optional override for formatting stack traces
   * @see https://v8.dev/docs/stack-trace-api#customizing-stack-traces
   */
  prepareStackTrace?: ((err: Error, stackTraces: Array<NodeJS_CallSite>) => any) | undefined;
  stackTraceLimit: number;
}

/**
 * The creator function for the pilet API.
 */
export interface PiletApiCreator {
  /**
   * Creates an API for the given raw pilet.
   * @param target The raw (meta) content of the pilet.
   * @returns The API object to be used with the pilet.
   */
  (target: PiletMetadata): PiletApi;
}

/**
 * The interface describing a function capable of fetching pilets.
 */
export interface PiletRequester {
  /**
   * Gets the raw pilets (e.g., from a server) asynchronously.
   */
  (): Promise<PiletEntries>;
}

/**
 * Additional configuration options for the default loader.
 */
export interface DefaultLoaderConfig {
  /**
   * Sets the cross-origin attribute of potential script tags.
   * For pilets v1 this may be useful. Otherwise, only pilets that
   * have an integrity defined will be set to "anonymous".
   */
  crossOrigin?: string;
  /**
   * Sets the override function for attaching a stylesheet.
   * This option will only affect `v3` pilets.
   * @param pilet The pilet containing the style sheet reference.
   * @param url The style sheet reference URL.
   */
  attachStyles?(pilet: Pilet, url: string): void;
}

/**
 * The callback to be used to load a single pilet.
 */
export interface PiletLoader {
  (entry: PiletEntry): Promise<Pilet>;
}

/**
 * Defines the spec identifiers for custom loading.
 */
export type CustomSpecLoaders = Record<string, PiletLoader>;

/**
 * A set of pipeline hooks used by the Piral loading orchestrator.
 */
export interface PiletLifecycleHooks {
  /**
   * Hook fired before a pilet is loaded.
   */
  loadPilet?(pilet: PiletMetadata): void;
  /**
   * Hook fired before a pilet is being set up.
   */
  setupPilet?(pilet: Pilet): void;
  /**
   * Hook fired before a pilet is being cleaned up.
   */
  cleanupPilet?(pilet: Pilet): void;
}

/**
 * The record containing all available dependencies.
 */
export interface AvailableDependencies {
  [name: string]: any;
}

/**
 * The strategy for how pilets are loaded at runtime.
 */
export interface PiletLoadingStrategy {
  (options: LoadPiletsOptions, pilets: PiletsLoaded): PromiseLike<void>;
}

/**
 * An evaluated single pilet.
 */
export type SinglePilet = SinglePiletApp & PiletMetadata;

/**
 * An evaluated multi pilet.
 */
export type MultiPilet = MultiPiletApp & PiletMetadata;

export const Symbol: SymbolConstructor;

export interface ArrayLike<T> {
  readonly length: number;
  [n: number]: T;
}

export interface Iterable<T, TReturn = any, TNext = any> {
  [Symbol.iterator](): Iterator<T, TReturn, TNext>;
}

export interface NestedTranslations {
  [tag: string]: string | NestedTranslations;
}

export type UnionOf<T> = {
  [K in keyof T]: T[K];
}[keyof T];

export interface PiralMenuType extends PiralCustomMenuTypes {
  /**
   * The general type. No extra options.
   */
  general: {};
  /**
   * The admin type. No extra options.
   */
  admin: {};
  /**
   * The user type. No extra options.
   */
  user: {};
  /**
   * The header type. No extra options.
   */
  header: {};
  /**
   * The footer type. No extra options.
   */
  footer: {};
}

export interface PiralNotificationTypes extends PiralCustomNotificationTypes {
  /**
   * The info type. No extra options.
   */
  info: {};
  /**
   * The success type. No extra options.
   */
  success: {};
  /**
   * The warning type. No extra options.
   */
  warning: {};
  /**
   * The error type. No extra options.
   */
  error: {};
}

export interface PiralCustomModalsMap {}

export interface PromiseConstructor {
  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Array<Awaited<T>>>;
  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
  /**
   * A reference to the prototype.
   */
  readonly prototype: Promise<any>;
  /**
   * Creates a new Promise.
   * @param executor A callback used to initialize the promise. This callback is passed two arguments:
   * a resolve callback used to resolve the promise with a value or the result of another promise,
   * and a reject callback used to reject the promise with a provided reason or error.
   */
  new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T extends readonly unknown[] | []>(values: T): Promise<{
    [P in keyof T]: Awaited<T[P]>;
  }>;
  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
  /**
   * Creates a new rejected promise for the provided reason.
   * @param reason The reason the promise was rejected.
   * @returns A new rejected Promise.
   */
  reject<T = never>(reason?: any): Promise<T>;
  /**
   * Creates a new resolved promise.
   * @returns A resolved promise.
   */
  resolve(): Promise<void>;
  /**
   * Creates a new resolved promise for the provided value.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve<T>(value: T): Promise<Awaited<T>>;
  /**
   * Creates a new resolved promise for the provided value.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
  readonly [Symbol.species]: PromiseConstructor;
  /**
   * Creates a Promise that is resolved with an array of results when all
   * of the provided Promises resolve or reject.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  allSettled<T extends readonly unknown[] | []>(values: T): Promise<{
    [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
  }>;
  /**
   * Creates a Promise that is resolved with an array of results when all
   * of the provided Promises resolve or reject.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<Array<PromiseSettledResult<Awaited<T>>>>;
}

export type RemainingArgs<T> = T extends (_: any, ...args: infer U) => any ? U : never;

export interface DateConstructor {
  /**
   * Creates a new Date.
   * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
   * @param monthIndex The month as a number between 0 and 11 (January to December).
   * @param date The date as a number between 1 and 31.
   * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
   * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
   * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
   * @param ms A number from 0 to 999 that specifies the milliseconds.
   */
  new (): Date;
  (): string;
  readonly prototype: Date;
  /**
   * Parses a string containing a date, and returns the number of milliseconds between that date and midnight, January 1, 1970.
   * @param s A date string
   */
  parse(s: string): number;
  /**
   * Returns the number of milliseconds between midnight, January 1, 1970 Universal Coordinated Time (UTC) (or GMT) and the specified date.
   * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
   * @param monthIndex The month as a number between 0 and 11 (January to December).
   * @param date The date as a number between 1 and 31.
   * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
   * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
   * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
   * @param ms A number from 0 to 999 that specifies the milliseconds.
   */
  UTC(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
  /**
   * Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
   */
  now(): number;
  /**
   * Returns the number of milliseconds between midnight, January 1, 1970 Universal Coordinated Time (UTC) (or GMT) and the specified date.
   * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
   * @param monthIndex The month as a number between 0 and 11 (January to December).
   * @param date The date as a number between 1 and 31.
   * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
   * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
   * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
   * @param ms A number from 0 to 999 that specifies the milliseconds.
   */
  UTC(year: number, monthIndex?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
}

/**
 * The context to be transported into the generic components.
 */
export interface ComponentContext {
  /**
   * The router-independent navigation API.
   */
  navigation: NavigationApi;
  /**
   * The internal router object.
   * @deprecated Exposes internals that can change at any time.
   */
  router: any;
  /**
   * The public path of the application.
   */
  publicPath: string;
}

/**
 * The base type for pilet component registration in the global state context.
 */
export interface BaseRegistration {
  /**
   * The pilet registering the component.
   */
  pilet: string;
}

export type WrappedComponent<TProps> = React.ComponentType<React.PropsWithChildren<Without<TProps, keyof BaseComponentProps>>>;

/**
 * Creates a new function.
 */
export const Function: FunctionConstructor;

/**
 * The entries representing pilets from a feed service response.
 */
export type PiletEntries = Array<PiletEntry>;

/**
 * Pilet entry representing part of a response from the feed service.
 */
export type PiletEntry = MultiPiletEntry | SinglePiletEntry;

/**
 * The callback to be used when pilets have been loaded.
 */
export interface PiletsLoaded {
  (error: Error | undefined, pilets: Array<Pilet>): void;
}

export interface PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}

/**
 * The pilet app, i.e., the functional exports.
 */
export interface SinglePiletApp {
  /**
   * Integrates the evaluated pilet into the application.
   * @param api The API to access the application.
   */
  setup(api: PiletApi): void | Promise<void>;
  /**
   * Optional function for cleanup.
   * @param api The API to access the application.
   */
  teardown?(api: PiletApi): void;
  /**
   * The referenced stylesheets to load / integrate.
   * This would only be used by v3 pilets.
   */
  styles?: Array<string>;
  /**
   * The referenced WebAssembly binaries to load / integrate.
   * This would only be used by v3 pilets.
   */
  assemblies?: Array<string>;
}

/**
 * The pilet app, i.e., the functional exports.
 */
export interface MultiPiletApp {
  /**
   * Integrates the evaluated pilet into the application.
   * @param api The API to access the application.
   */
  setup(apiFactory: PiletApiCreator): void | Promise<void>;
}

export interface SymbolConstructor {
  /**
   * A method that returns the default iterator for an object. Called by the semantics of the
   * for-of statement.
   */
  readonly iterator: unique symbol;
  /**
   * A reference to the prototype.
   */
  readonly prototype: Symbol;
  /**
   * Returns a new unique Symbol value.
   * @param description Description of the new Symbol object.
   */
  (description?: string | number): symbol;
  /**
   * Returns a Symbol object from the global symbol registry matching the given key if found.
   * Otherwise, returns a new symbol with this key.
   * @param key key to search for.
   */
  for(key: string): symbol;
  /**
   * Returns a key from the global symbol registry matching the given Symbol if found.
   * Otherwise, returns a undefined.
   * @param sym Symbol to find the key for.
   */
  keyFor(sym: symbol): string | undefined;
  /**
   * A method that determines if a constructor object recognizes an object as one of the
   * constructor’s instances. Called by the semantics of the instanceof operator.
   */
  readonly hasInstance: unique symbol;
  /**
   * A Boolean value that if true indicates that an object should flatten to its array elements
   * by Array.prototype.concat.
   */
  readonly isConcatSpreadable: unique symbol;
  /**
   * A regular expression method that matches the regular expression against a string. Called
   * by the String.prototype.match method.
   */
  readonly match: unique symbol;
  /**
   * A regular expression method that replaces matched substrings of a string. Called by the
   * String.prototype.replace method.
   */
  readonly replace: unique symbol;
  /**
   * A regular expression method that returns the index within a string that matches the
   * regular expression. Called by the String.prototype.search method.
   */
  readonly search: unique symbol;
  /**
   * A function valued property that is the constructor function that is used to create
   * derived objects.
   */
  readonly species: unique symbol;
  /**
   * A regular expression method that splits a string at the indices that match the regular
   * expression. Called by the String.prototype.split method.
   */
  readonly split: unique symbol;
  /**
   * A method that converts an object to a corresponding primitive value.
   * Called by the ToPrimitive abstract operation.
   */
  readonly toPrimitive: unique symbol;
  /**
   * A String value that is used in the creation of the default string description of an object.
   * Called by the built-in method Object.prototype.toString.
   */
  readonly toStringTag: unique symbol;
  /**
   * An Object whose truthy properties are properties that are excluded from the 'with'
   * environment bindings of the associated objects.
   */
  readonly unscopables: unique symbol;
  /**
   * A method that returns the default async iterator for an object. Called by the semantics of
   * the for-await-of statement.
   */
  readonly asyncIterator: unique symbol;
  /**
   * A regular expression method that matches the regular expression against a string. Called
   * by the String.prototype.matchAll method.
   */
  readonly matchAll: unique symbol;
  readonly dispose: unique symbol;
  readonly asyncDispose: unique symbol;
}

export interface Iterator<T, TReturn = any, TNext = any> {
  next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}

export interface PiralCustomMenuTypes {}

export interface PiralCustomNotificationTypes {}

/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
export type Awaited<T> = T extends null | undefined ? T : T extends object & {
  then(onfulfilled: infer F, ...args: infer _): any;
} ? F extends ((value: infer V, ...args: infer _) => any) ? Awaited<V> : never : T;

export type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

export interface NavigationApi {
  /**
   * Pushes a new location onto the history stack.
   */
  push(target: string, state?: any): void;
  /**
   * Replaces the current location with another.
   */
  replace(target: string, state?: any): void;
  /**
   * Changes the current index in the history stack by a given delta.
   */
  go(n: number): void;
  /**
   * Prevents changes to the history stack from happening.
   * This is useful when you want to prevent the user navigating
   * away from the current page, for example when they have some
   * unsaved data on the current page.
   * @param blocker The function being called with a transition request.
   * @returns The disposable for stopping the block.
   */
  block(blocker: NavigationBlocker): Disposable;
  /**
   * Starts listening for location changes and calls the given
   * callback with an Update when it does.
   * @param listener The function being called when the route changes.
   * @returns The disposable for stopping the block.
   */
  listen(listener: NavigationListener): Disposable;
  /**
   * Gets the current navigation / application path.
   */
  path: string;
  /**
   * Gets the current navigation path incl. search and hash parts.
   */
  url: string;
  /**
   * The original router behind the navigation. Don't depend on this
   * as the implementation is router specific and may change over time.
   */
  router: any;
  /**
   * Gets the public path of the application.
   */
  publicPath: string;
}

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface FunctionConstructor {
  /**
   * Creates a new function.
   * @param args A list of arguments the function accepts.
   */
  new (...args: Array<string>): Function;
  (...args: Array<string>): Function;
  readonly prototype: Function;
}

/**
 * The metadata response for a multi pilet.
 */
export type MultiPiletEntry = PiletBundleEntry;

/**
 * The metadata response for a single pilet.
 */
export type SinglePiletEntry = PiletV0Entry | PiletV1Entry | PiletV2Entry | PiletV3Entry | PiletMfEntry | PiletVxEntry;

export type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;

export interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

export interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

export interface NavigationBlocker {
  (tx: NavigationTransition): void;
}

export interface NavigationListener {
  (update: NavigationUpdate): void;
}

/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Exclude from T those types that are assignable to U
 */
export type Exclude<T, U> = T extends U ? never : T;

/**
 * Metadata for pilets using the bundle schema.
 */
export interface PiletBundleEntry {
  /**
   * The name of the bundle pilet, i.e., the package id.
   */
  name?: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: "v1";
  /**
   * The link for retrieving the bundle content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global bundle-shared require.
   */
  bundle: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v0 schema.
 */
export type PiletV0Entry = PiletV0ContentEntry | PiletV0LinkEntry;

/**
 * Metadata for pilets using the v1 schema.
 */
export interface PiletV1Entry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: "v1";
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v2 schema.
 */
export interface PiletV2Entry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: "v2";
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v3 schema.
 */
export interface PiletV3Entry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: "v3";
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The fallback link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The links for specific variations of the pilet, e.g., "client", "server", ...
   */
  variations?: Record<string, string>;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v2 schema.
 */
export interface PiletMfEntry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: "mf";
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The fallback link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
}

export interface PiletVxEntry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides an identifier for the custom specification.
   */
  spec: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

export interface IteratorYieldResult<TYield> {
  done?: false;
  value: TYield;
}

export interface IteratorReturnResult<TReturn> {
  done: true;
  value: TReturn;
}

export interface NavigationTransition extends NavigationUpdate {
  retry?(): void;
}

export interface NavigationUpdate {
  action: NavigationAction;
  location: NavigationLocation;
}

/**
 * Metadata for pilets using the v0 schema with a content.
 */
export interface PiletV0ContentEntry extends PiletV0BaseEntry {
  /**
   * The content of the pilet. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content: string;
  /**
   * If available indicates that the pilet should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
}

/**
 * Metadata for pilets using the v0 schema with a link.
 */
export interface PiletV0LinkEntry extends PiletV0BaseEntry {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
}

export type NavigationAction = "POP" | "PUSH" | "REPLACE";

export interface NavigationLocation {
  /**
   * The fully qualified URL incl. the origin and base path.
   */
  href: string;
  /**
   * The location.pathname property is a string that contains an initial "/"
   * followed by the remainder of the URL up to the ?.
   */
  pathname: string;
  /**
   * The location.search property is a string that contains an initial "?"
   * followed by the key=value pairs in the query string. If there are no
   * parameters, this value may be the empty string (i.e. '').
   */
  search: string;
  /**
   * The location.hash property is a string that contains an initial "#"
   * followed by fragment identifier of the URL. If there is no fragment
   * identifier, this value may be the empty string (i.e. '').
   */
  hash: string;
  /**
   * The location.state property is a user-supplied State object that is
   * associated with this location. This can be a useful place to store
   * any information you do not want to put in the URL, e.g. session-specific
   * data.
   */
  state: unknown;
  /**
   * The location.key property is a unique string associated with this location.
   * On the initial location, this will be the string default. On all subsequent
   * locations, this string will be a unique identifier.
   */
  key?: string;
}

/**
 * Basic metadata for pilets using the v0 schema.
 */
export interface PiletV0BaseEntry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: "v0";
  /**
   * The computed hash value of the pilet's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}