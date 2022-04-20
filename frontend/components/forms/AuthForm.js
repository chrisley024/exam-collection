import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSubmit,
  page,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        {page !== "Login" && (
          <div className="form-group p-2">
            <small>
              <label htmlFor="username" className="text-muted">
                Your Username
              </label>
            </small>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="form-control p-2"
              placeholder="Enter your username..."
            />
          </div>
        )}

        <div className="form-group p-2">
          <small>
            <label htmlFor="email" className="text-muted">
              Your Email
            </label>
          </small>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control p-2"
            placeholder="Enter your email..."
          />
        </div>
        <div className="form-group p-2">
          <small>
            <label htmlFor="password" className="text-muted">
              Your Password
            </label>
          </small>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control p-2"
            placeholder="Enter your password..."
          />
        </div>
        <div className="form-group p-2">
          <button
            className="btn btn-primary col-12"
            type="submit"
            disabled={
              page === "Login"
                ? !email || !password || loading
                : !username || !email || !password || loading
            }
          >
            {loading ? <SyncOutlined spin className="py-1" /> : page}
          </button>
        </div>
      </form>
    </>
  );
};

export default AuthForm;
