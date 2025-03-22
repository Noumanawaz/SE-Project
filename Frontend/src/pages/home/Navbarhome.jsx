import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

// import  firebaseConfig from "./firebaseConfig.js";
import firebaseConfig from "../firebaseConfig";

// Initialize Firebase only if it hasn't been initialized already

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/aboutus" },
  { name: "Contact Us", href: "/contactus" },
  { name: "SignIn", href: "/signin" },
  
  { name: "SignUp", href: "/signup" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbarhome() {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <Disclosure as="nav" className="w-full h-16 sticky bg-gray-800">
      {({ open }) => (
        <>
          <div className="w-full h-16 sm:px-6 lg:px-8">
            <div className="w-full flex h-16 items-center justify-between">
              <div className="flex items-center">
                <img
                  className="h-12 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <div className="flex sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden sm:flex sm:space-x-4">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className={classNames(
                      "rounded-md md:px-3 py-2 font-medium cursor-pointer sm:text-xl md:text-2xl text-gray-300 hover:text-white"
                    )}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="w-full sm:hidden z-999 backdrop-blur-md bg-white/30">
            <div className="flex flex-col items-center space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="div"
                  onClick={() => handleNavigation(item)}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-800 w-full hover:bg-gray-500 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium cursor-pointer"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
