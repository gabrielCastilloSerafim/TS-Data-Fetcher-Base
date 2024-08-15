import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import performRequest from "./Services/Network/DataFetcher";
import { FetchError, HTTPMethod } from "./Services/Network/Entities";
import { ServerEndpoints } from "./Services/Network/ServerEndpoints";
import { User } from "./Services/AppEntities/User";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    createUser();
  }, [count]);

  async function createUser() {
    const newUser = {
      name: "Gabriel",
      surname: "Castillo",
      email: "some@email.com",
      password: "12345678",
    };
    try {
      // await performRequest<null>(
      //   HTTPMethod.POST,
      //   ServerEndpoints.signUp(),
      //   newUser
      // );
      const user = await performRequest<User>(
        HTTPMethod.GET,
        ServerEndpoints.userMe(),
        null
      );
      console.log(user);
    } catch (error) {
      console.log(error as FetchError);
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
