/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface UserManagerInterface extends Interface {
  getFunction(
    nameOrSignature: "isRegistered" | "login" | "logout" | "register"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "UserLoggedIn" | "UserLoggedOut" | "UserRegistered"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "isRegistered",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "login", values?: undefined): string;
  encodeFunctionData(functionFragment: "logout", values?: undefined): string;
  encodeFunctionData(functionFragment: "register", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "isRegistered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "login", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "logout", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
}

export namespace UserLoggedInEvent {
  export type InputTuple = [user: AddressLike];
  export type OutputTuple = [user: string];
  export interface OutputObject {
    user: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UserLoggedOutEvent {
  export type InputTuple = [user: AddressLike];
  export type OutputTuple = [user: string];
  export interface OutputObject {
    user: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UserRegisteredEvent {
  export type InputTuple = [user: AddressLike];
  export type OutputTuple = [user: string];
  export interface OutputObject {
    user: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface UserManager extends BaseContract {
  connect(runner?: ContractRunner | null): UserManager;
  waitForDeployment(): Promise<this>;

  interface: UserManagerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  isRegistered: TypedContractMethod<[user: AddressLike], [boolean], "view">;

  login: TypedContractMethod<[], [void], "nonpayable">;

  logout: TypedContractMethod<[], [void], "nonpayable">;

  register: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "isRegistered"
  ): TypedContractMethod<[user: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "login"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "logout"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "register"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "UserLoggedIn"
  ): TypedContractEvent<
    UserLoggedInEvent.InputTuple,
    UserLoggedInEvent.OutputTuple,
    UserLoggedInEvent.OutputObject
  >;
  getEvent(
    key: "UserLoggedOut"
  ): TypedContractEvent<
    UserLoggedOutEvent.InputTuple,
    UserLoggedOutEvent.OutputTuple,
    UserLoggedOutEvent.OutputObject
  >;
  getEvent(
    key: "UserRegistered"
  ): TypedContractEvent<
    UserRegisteredEvent.InputTuple,
    UserRegisteredEvent.OutputTuple,
    UserRegisteredEvent.OutputObject
  >;

  filters: {
    "UserLoggedIn(address)": TypedContractEvent<
      UserLoggedInEvent.InputTuple,
      UserLoggedInEvent.OutputTuple,
      UserLoggedInEvent.OutputObject
    >;
    UserLoggedIn: TypedContractEvent<
      UserLoggedInEvent.InputTuple,
      UserLoggedInEvent.OutputTuple,
      UserLoggedInEvent.OutputObject
    >;

    "UserLoggedOut(address)": TypedContractEvent<
      UserLoggedOutEvent.InputTuple,
      UserLoggedOutEvent.OutputTuple,
      UserLoggedOutEvent.OutputObject
    >;
    UserLoggedOut: TypedContractEvent<
      UserLoggedOutEvent.InputTuple,
      UserLoggedOutEvent.OutputTuple,
      UserLoggedOutEvent.OutputObject
    >;

    "UserRegistered(address)": TypedContractEvent<
      UserRegisteredEvent.InputTuple,
      UserRegisteredEvent.OutputTuple,
      UserRegisteredEvent.OutputObject
    >;
    UserRegistered: TypedContractEvent<
      UserRegisteredEvent.InputTuple,
      UserRegisteredEvent.OutputTuple,
      UserRegisteredEvent.OutputObject
    >;
  };
}
