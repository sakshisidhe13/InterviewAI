import { getSavedUser } from "../../lib/api";

export default function Topbar({
  title = "Dashboard",
}) {

    const user = getSavedUser();

    return(

        <header className="topbar">

            <div>

                <h1>{title}</h1>

                <p>

                    Welcome,
                    {user?.name}

                </p>

            </div>

            <div className="avatar">

                {user?.name
                    ?.slice(0,2)
                    .toUpperCase()}

            </div>

        </header>

    );

}