import { CheckCircle2 } from "lucide-react"

export default function GuidePage() {
  const steps = [
    {
      step: 1,
      title: "Recevez le signal",
      text: "Chaque 1er du mois, vous recevez un email avec les 5 actions sélectionnées par l'algorithme Dual Momentum."
    },
    {
      step: 2,
      title: "Ouvrez votre broker",
      text: "Connectez-vous à votre broker habituel (Degiro, Interactive Brokers, Boursorama...). Aucun broker partenaire, liberté totale."
    },
    {
      step: 3,
      title: "Investissez en parts égales",
      text: "Divisez votre capital en 5 parts égales. Achetez chaque action sélectionnée au prix du marché."
    },
    {
      step: 4,
      title: "Attendez",
      text: "Ne touchez à rien jusqu'au signal suivant. L'algorithme gère la stratégie — pas d'émotion, pas de décision."
    },
    {
      step: 5,
      title: "Rééquilibrez",
      text: "Au prochain signal, vendez les positions sortantes, achetez les nouvelles. 15 minutes par mois maximum."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">De la théorie à la pratique</h1>
        <p className="text-xl text-slate-400">
          Comment utiliser les signaux Citadel Alpha au quotidien
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((item) => (
          <div key={item.step} className="bg-[#1E293B] border border-slate-800 rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3B82F6]/20 flex items-center justify-center border border-[#3B82F6]/30">
                <span className="text-[#3B82F6] font-bold text-xl">{item.step}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Étape {item.step} — {item.title}</h2>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-6 text-center">
        <h3 className="text-[#F59E0B] font-semibold mb-2">Note importante :</h3>
        <p className="text-slate-300">
          Citadel Alpha n'exécute pas les trades à votre place. Nous fournissons les signaux, vous exécutez librement.
        </p>
      </div>
    </div>
  )
}
