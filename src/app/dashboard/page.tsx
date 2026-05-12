"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  PATIENT: "Paciente",
  DOCTOR: "Médico",
  NURSE: "Enfermero/a",
  ADMIN: "Administrador",
  RECEPTIONIST: "Recepcionista",
};

const DOC_LABELS: Record<string, string> = {
  DNI: "DNI",
  PASSPORT: "Pasaporte",
  FOREIGN_ID: "Identificación Extranjera",
  RUC: "RUC",
};

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionEmail, setSessionEmail] = useState("");
  const [sessionRole, setSessionRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId =
      localStorage.getItem("userId") ?? sessionStorage.getItem("userId");
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    const email =
      localStorage.getItem("email") ?? sessionStorage.getItem("email") ?? "";
    const role =
      localStorage.getItem("role") ?? sessionStorage.getItem("role") ?? "";

    if (!userId || !token) {
      router.push("/");
      return;
    }

    setSessionEmail(email);
    setSessionRole(role);

    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        return res.json() as Promise<UserProfile>;
      })
      .then(setUser)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    ["token", "userId", "role", "email"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    router.push("/");
  }

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "??";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-black text-xl">
            +
          </div>
          <div>
            <p className="font-bold text-gray-900">Hospital San Rafael</p>
            <p className="text-xs text-gray-500">Portal del Paciente</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{sessionEmail}</span>
          {sessionRole === "ADMIN" && (
            <Link
              href="/register/staff"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              + Registrar personal
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi perfil</h1>

        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
            Cargando perfil...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {user && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header card */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-8 flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-black backdrop-blur-sm">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mt-1.5 backdrop-blur-sm">
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              </div>
              <div className="ml-auto">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    user.isActive
                      ? "bg-green-400/20 text-green-100"
                      : "bg-red-400/20 text-red-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.isActive ? "bg-green-300" : "bg-red-300"
                    }`}
                  />
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {/* Data grid */}
            <dl className="grid grid-cols-2 gap-px bg-gray-100">
              {[
                ["Correo electrónico", user.email],
                ["Teléfono", user.phone],
                ["Tipo de documento", DOC_LABELS[user.documentType] ?? user.documentType],
                ["Número de documento", user.documentNumber],
                [
                  "Miembro desde",
                  new Date(user.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                ],
                ["ID de usuario", user.id],
              ].map(([label, value]) => (
                <div key={label} className="bg-white px-8 py-5">
                  <dt className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-gray-800 truncate">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
