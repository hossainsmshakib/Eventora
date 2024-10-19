import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const UserAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        {isLogin ? "Login" : "Register"}
      </h1>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default UserAuthPage;
