import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import React, { useEffect, useState } from "react"

const VerifyEmail = () => {
    const { token } = useParams()
    const [status, setStatus] = useState("Verifying...")
    const navigate = useNavigate()

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await api.get(`/user/verify/${token}`)
                if (res.data.success) {
                    setStatus("✅ Email Verified Successfully")
                    setTimeout(() => navigate("/login"), 2000)
                }
            } catch (error) {
                setStatus("❌ Verification link expired or invalid")
            }
        }

        if (token) verifyEmail()
    }, [token, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-100">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-xl font-semibold">{status}</h2>
            </div>
        </div>
    )
}

export default VerifyEmail
