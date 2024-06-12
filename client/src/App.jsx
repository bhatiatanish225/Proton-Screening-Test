import React, { createContext, useEffect, useLayoutEffect, useState } from "react";
import { Menu } from "./components";
import { Routes, Route } from "react-router-dom";
import { Error, Forgot, Login, Main, Signup } from "./page";
import { useSelector } from "react-redux";
import ProtectedRoute from "./protected";
import Loading from "./components/loading/loading";
import instance from "./config/instance";
import { ThemeProvider, ThemeContext } from "./components/context/ThemeContext"; // Import ThemeProvider and ThemeContext
import ThemeToggle from "./components/menu/ThemeToggle"; // Import ThemeToggle

export const documentsContext = createContext({
  documents: [],
  setDocuments: () => {},
  getFiles: () => {},
});

const App = () => {
  const [offline, setOffline] = useState(!window.navigator.onLine);
  const [file_id, set_file_id] = useState(null);
  const { loading, user } = useSelector((state) => state);
  const [documents, setDocuments] = useState([]);
  const { _id } = useSelector((state) => state.messages);

  const getFiles = async () => {
    let res = null;
    if (!_id) return console.log("No chat id");
    else {
      try {
        res = await instance.get("/api/chat/upload?chatId=" + _id);
      } catch (err) {
        console.log(err);
      } finally {
        if (res?.data) {
          console.log(res.data);
          setDocuments(res?.data?.data);
        }
      }
    }
  };

  // Offline
  useEffect(() => {
    window.addEventListener("online", (e) => {
      location.reload();
    });

    window.addEventListener("offline", (e) => {
      setOffline(true);
    });
  }, []);

  return (
    <ThemeProvider>
      <documentsContext.Provider value={{ documents, setDocuments, getFiles }}>
        <section className={user ? "main-grid" : null}>
          {user && (
            <div>
              <Menu
                file_id={file_id}
                set_file_id={set_file_id}
              />
              <ThemeToggle /> {/* Add ThemeToggle here */}
            </div>
          )}

          {loading && <Loading />}

          {offline && (
            <Error
              status={503}
              content={"Website in offline check your network."}
            />
          )}

          <Routes>
            <Route element={<ProtectedRoute offline={offline} authed={true} />}>
              <Route
                exact
                path="/"
                element={
                  <Main
                    file_id={file_id}
                    set_file_id={set_file_id}
                  />
                }
              />
              <Route
                path="/chat"
                element={
                  <Main
                    file_id={file_id}
                    set_file_id={set_file_id}
                  />
                }
              />
              <Route
                path="/chat/:id"
                element={
                  <Main
                    file_id={file_id}
                    set_file_id={set_file_id}
                  />
                }
              />
            </Route>

            <Route element={<ProtectedRoute offline={offline} />}>
              <Route path="/login" element={<Login />} />
              <Route path="/login/auth" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/pending/:id" element={<Signup />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/forgot/set/:userId/:secret" element={<Forgot />} />
            </Route>
            <Route
              path="*"
              element={
                <Error status={404} content={"This page could not be found."} />
              }
            />
          </Routes>
        </section>
      </documentsContext.Provider>
    </ThemeProvider>
  );
};

export default App;
