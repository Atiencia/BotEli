import { Shield, Lock, EyeOff, Server, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm font-medium text-sky-400 hover:text-sky-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Link>

        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Política de Privacidad</h1>
          </div>

          <div className="prose prose-invert prose-sky max-w-none space-y-8">
            
            <section className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-sky-400" />
                Nuestro compromiso con tus datos
              </h2>
              <p className="text-gray-300 leading-relaxed">
                <strong>EliBot</strong> es una herramienta de automatización diseñada exclusivamente para ayudar a responder mensajes en redes sociales mediante Inteligencia Artificial. Queremos ser absolutamente transparentes: <strong>no vendemos, no alquilamos y no comercializamos los datos personales ni los mensajes de tus clientes.</strong>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white mb-3">1. Uso de la Información</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                La aplicación únicamente accede a los mensajes de Instagram (a través de la API oficial de Meta) con el único y exclusivo propósito de:
              </p>
              <ul className="list-disc pl-5 text-gray-400 space-y-2">
                <li>Leer el contenido del mensaje entrante.</li>
                <li>Procesar el contexto utilizando modelos de lenguaje (IA) para generar una respuesta útil.</li>
                <li>Enviar la respuesta automatizada de vuelta al usuario a través de Instagram.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" />
                2. Privacidad y Seguridad
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Los mensajes procesados por EliBot se utilizan estrictamente en tiempo real para generar la respuesta pertinente. Los datos de las conversaciones y perfiles de los usuarios que interactúan con el bot están protegidos mediante cifrado y almacenados de manera segura exclusivamente para mantener el historial de la conversación necesario para que el bot tenga contexto, y para mostrar las analíticas privadas al dueño de la cuenta. <strong>Nadie más tiene acceso a estos datos.</strong>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-gray-400" />
                3. Interacción con Meta y Terceros
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Cumplimos estrictamente con las políticas para desarrolladores de Meta. La información recibida a través de webhooks no se comparte con redes de publicidad, corredores de datos ni ninguna otra entidad de terceros externa a los servicios de infraestructura en la nube necesarios para operar la aplicación (como nuestro proveedor de base de datos y procesamiento de IA).
              </p>
            </section>

            <section className="pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
                <br />
                Si tienes dudas sobre cómo procesamos los datos, puedes contactarnos a través del administrador del sistema.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}



