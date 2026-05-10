// src/pages/Login.jsx
export default function Login() {
  return (

     <div class="font-serif bg-gray-50">
        <div class="text-center flex flex-col  min-h-screen justify-center items-center p-4 relative">

            <div class="text-center mb-4">
                <h2 class="text-3xl italic text-slate-800">BookVerse</h2>
                <p class="uppercase tracking-[0.3em] text-[10px] text-slate-500 mt-1">
                    curated for the bibliophile</p>
            </div>



            <div class="bg-white border border-slate-200 w-full max-w-md py-8 px-12 md:p-10 shadow-sm">
                <div class="text-left mb-8">
                    <h3 class="text-xl text-slate-800 mb-2">Welcome Back</h3>
                    <p class="text-slate-500 text-sm mb-2">Please enter your details to access your collection.</p>
                </div>


                <form action="#" class="space-y-5">
                    <div class="flex flex-col">
                        <label for="email" class="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700">email address</label>
                        <input type="email" id="email" placeholder="e.g. reader@bookverse.com"
                            class="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors
                             placeholder:text-slate-300 text-sm"/>
                    </div>

                    <div class="flex flex-col">
                        <div class="flex justify-between items-end">
                            <label for="password"
                                class="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700">password</label>
                            <a href="#" class="text-[14px] text-red-400 hover:text-red-600 transition-colors">Forget
                                Password?</a>
                        </div>
                        <input type="password" id="password" placeholder="........"
                            class="border-b border-slate-300 py-1 focus:outline-none focus:border-slate-900 transition-colors
                             placeholder:text-slate-300 text-[25px]"/>
                    </div>

                    <div class="flex items-center space-x-1 py-1">
                        <input type="checkbox" id="checkbox" class="w-4 h-4 border-slate-300 rounded accent-slate-900"/>
                        <label for="checkbox" class="text-[14px] text-slate-600"> Remember me for 30 days</label>
                    </div>

                    <div class="w-full bg-slate-900 text-white py-3 text-[15px] tracking-[0.2em] font-semibold
                     hover:bg-slate-400 cursor-pointer transition-all mt-3">
                        <input type="button" id="submit"/>
                        <label for="submit">Sign In</label>
                    </div>
                </form>


                <div class="mt-4 text-center text-sm text-slate-600 border-t border-slate-100 pt-2"><span>Don't have an account?</span>
                    <a href="#" class="font-bold text-slate-900 hover:underline">Register</a>

                </div>
            </div>

        </div>
    </div>


  );
}