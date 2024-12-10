import { Outlet } from "react-router";
import Header from "./components/header";
import Footer from "./components/footer";
import { useState } from "react";

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Outlet context={[searchTerm, setSearchTerm]} />
            <Footer />
        </>
    )
}

export default Layout;
