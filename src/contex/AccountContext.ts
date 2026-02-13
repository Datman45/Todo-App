"use client";

import { createContext } from "react";

export interface IAccountInfo {
	token?: string;
	refreshToken?: string;
}
export interface IAccountState {
	accountInfo?: IAccountInfo;
	setAccountInfo?: (value: IAccountInfo) => void;
}
export const AccountContext = createContext<IAccountState>({});
