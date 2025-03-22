import React from "react";
import { FaUserGraduate, FaHandHoldingHeart, FaUsers } from "react-icons/fa";

const AboutPlatform = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
                {/* Grid pattern for texture */}
                <div className="absolute inset-0" 
                    style={{
                        backgroundImage: "radial-gradient(#6366f1 1px, transparent 1px)",
                        backgroundSize: "30px 30px"
                    }}
                />
            </div>

            {/* Section Title with animations */}
            <div className="text-center mb-16 relative z-10">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase opacity-0 animate-[fadeInUp_0.5s_0.3s_forwards]">
                    Our Community
                </h2>
                <h2 className="mt-2 text-4xl sm:text-5xl font-bold text-gray-900 opacity-0 animate-[fadeInUp_0.5s_0.5s_forwards]">
                    About Our Platform
                </h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-[fadeInUp_0.5s_0.7s_forwards]">
                    Connecting students, donors, and admins to create a brighter future.
                </p>
            </div>

            {/* Benefits Grid with glass morphism cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Student Card */}
                <div className="group flex flex-col items-center text-center p-8 rounded-xl opacity-0 animate-[fadeInUp_0.5s_0.7s_forwards]
                    bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm border border-blue-100 shadow-xl 
                    hover:shadow-2xl hover:shadow-blue-200/30 hover:-translate-y-2 transition-all duration-300">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FaUserGraduate className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">For Students</h3>
                    <p className="text-gray-600">
                        Apply for grants and unlock new opportunities to pursue your dreams and educational goals.
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-6"></div>
                </div>

                {/* Donor Card */}
                <div className="group flex flex-col items-center text-center p-8 rounded-xl opacity-0 animate-[fadeInUp_0.5s_0.9s_forwards]
                    bg-gradient-to-br from-white to-green-50 backdrop-blur-sm border border-green-100 shadow-xl 
                    hover:shadow-2xl hover:shadow-green-200/30 hover:-translate-y-2 transition-all duration-300">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FaHandHoldingHeart className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">For Donors</h3>
                    <p className="text-gray-600">
                        Make a lasting impact by supporting talented and deserving students on their educational journey.
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-6"></div>
                </div>

                {/* Admin Card */}
                <div className="group flex flex-col items-center text-center p-8 rounded-xl opacity-0 animate-[fadeInUp_0.5s_1.1s_forwards]
                    bg-gradient-to-br from-white to-purple-50 backdrop-blur-sm border border-purple-100 shadow-xl 
                    hover:shadow-2xl hover:shadow-purple-200/30 hover:-translate-y-2 transition-all duration-300">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FaUsers className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">For Admins</h3>
                    <p className="text-gray-600">
                        Streamline grant management and create meaningful connections between donors and students.
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mt-6"></div>
                </div>
            </div>
        </section>
    );
};

export default AboutPlatform;