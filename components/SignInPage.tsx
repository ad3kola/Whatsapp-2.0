"use client";
import { auth, provider } from "@/firebase.config";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";

function SignInPage() {
  const signInUser = () => {
    console.log("clicked");
    signInWithPopup(auth, provider)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };
  return (
    <div className="flex flex-col items-center relative  justify-center h-screen w-full space-y-3 text-center">
      <h2 className="text-4xl font-bold capitalize">
        Welcome to Whatsapp 2.0
      </h2>
      <h3 className="text-black text-sm font-semibold tracking-wide">
        Click the button below to sign in
      </h3>
      <div className="flex flex-col max-w-fit p-12 rounded-md items-center justify-center shadow-lg shadow-gray-600 space-y-5">
        <Image
          src={"/assets/whatsapp-logo.png"}
          alt="whatsapp-logo"
          width={250}
          height={250}
          className="object-cover object-center"
        />
        <button
          onClick={signInUser}
          className="flex items-center justify-center rounded-md shadow-md hover:scale-105 duration-200 transition ease-in-out text-white bg-black p-3 cursor-pointer"
        >
          <Image
            src={"/assets/google-logo.png"}
            height={35}
            alt="google-logo"
            width={35}
            className="object-contain object-center mr-5 border-none outline-none"
          />
          Sign in with Google
        </button>
      </div>
      <h4 className="bg-gradient-to-r from-green-800 via-green-600 to-green-800 bg-clip-text text-transparent absolute bottom-5 left-1/2 -translate-x-1/2 font-bold text-xl">
        Adekola Adedeji
      </h4>
    </div>
  );
}
export default SignInPage;
