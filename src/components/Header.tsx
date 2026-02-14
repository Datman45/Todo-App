"use client";

import { AccountContext } from "@/contex/AccountContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const BASE_URL = process.env.BASE_URL || "";

const Header = () => {
	const { accountInfo, setAccountInfo } = useContext(AccountContext);
	const router = useRouter();
	return (
		<header>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<div className="navbar-brand">Todo Task Management App</div>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className="collapse navbar-collapse"
						id="navbarSupportedContent"
					>
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item dropdown">
								{accountInfo?.token && (
									<a
										className="nav-link dropdown-toggle"
										href="#"
										id="userDropdown"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Todo
									</a>
								)}

								<div
									className="dropdown-menu"
									aria-labelledby="userDropdown"
								>
									<Link
										className="dropdown-item"
										href="/todoTask"
									>
										Tasks
									</Link>
								</div>
							</li>
						</ul>
						<ul className="navbar-nav">
							<li className="nav-item">
								{!accountInfo?.token && (
									<Link className="nav-link" href="/register">
										Register
									</Link>
								)}
							</li>
							<li className="nav-item">
								{!accountInfo?.token && (
									<Link className="nav-link" href="/login">
										Login
									</Link>
								)}
							</li>
						</ul>

						<ul className="navbar-nav">
							{accountInfo?.token && (
								<a
									className="nav-link"
									href="#"
									onClick={() => {
										setAccountInfo!({});
										router.push("/");
									}}
								>
									Logout
								</a>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
};
export default Header;
