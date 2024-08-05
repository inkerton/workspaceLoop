import React from 'react'

function Hero() {
  return (
    <section className="bg-white text-white">
        <div className="mx-auto max-w-screen-xl px-4 mt-10 lg:flex lg:mt-40 ">
            {/* lg:h-screen lg:items-center */}
            <div className="mx-auto max-w-2xl text-center">
            <h1
                className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
            >
                Manage you Workspace

                <span className="sm:block"> Control your loop </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-black">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus
                numquam ea!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                className="block w-full rounded border border-primary bg-primary px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-black focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/signin"
                >
                Get Started
                </a>

            </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
