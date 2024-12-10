import { useSelector } from "react-redux";
import NotPermitted from "./NotPermitted";
import AdminPage from "../admin";

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const roleUser = useSelector(state => state?.account?.user?.role);
    const isAdmin = isAdminRoute && roleUser === 'ADMIN' ? true : false;

    if (isAdmin || !isAdminRoute && (roleUser === 'USER' || roleUser === 'ADMIN')) {
        return (<>{props.children}</>);
    } else {
        return (<NotPermitted />);
    }

}

export default RoleBaseRoute;