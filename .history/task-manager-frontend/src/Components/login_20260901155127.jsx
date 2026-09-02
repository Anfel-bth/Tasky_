export default function Login() {
    return (
        <div className="min-h-screen bg-white font-[Manrope] text-[#474A57]">
            <h1>Login</h1>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}