export default function FAQPage() {
  const faqs = [
    {
      q: "C'est quoi exactement le Dual Momentum ?",
      a: "Le Dual Momentum est une stratégie quantitative développée par Gary Antonacci. Elle sélectionne chaque mois les actions avec le meilleur momentum relatif (vs les autres) ET absolu (vs le cash). Citadel Alpha l'applique sur les 500 plus grandes entreprises américaines avec 5 filtres supplémentaires pour réduire le risque."
    },
    {
      q: "Combien de temps faut-il y consacrer ?",
      a: "15 minutes par mois maximum. Vous recevez un email, vous passez 5 trades sur votre broker, c'est tout."
    },
    {
      q: "Quel capital minimum recommandez-vous ?",
      a: "5 000€ minimum pour absorber les frais de courtage. Idéalement 10 000€+ pour pleinement profiter de la diversification sur 5 positions."
    },
    {
      q: "Est-ce que Citadel Alpha gère mon argent ?",
      a: "Non. Nous fournissons uniquement des signaux algorithmiques. Vous gardez le contrôle total de votre capital sur votre propre compte broker."
    },
    {
      q: "Les performances passées garantissent-elles les futures ?",
      a: "Non — aucune stratégie ne peut garantir des résultats futurs. Le backtest sur 10 ans (2016-2026) est fourni à titre informatif. Les marchés peuvent évoluer différemment dans le futur."
    },
    {
      q: "Puis-je annuler à tout moment ?",
      a: "Oui, sans frais ni engagement. Annulation en un clic depuis votre espace membre."
    },
    {
      q: "La stratégie fonctionne-t-elle en bear market ?",
      a: "Oui — le filtre SPY absolu détecte les marchés baissiers et bascule automatiquement en cash pour protéger le capital."
    },
    {
      q: "Quelle différence avec un ETF S&P 500 classique ?",
      a: "Le S&P 500 fait ~15% CAGR avec -30% de drawdown max. Citadel Alpha vise 33.9% CAGR avec -24.3% de drawdown sur 10 ans backtestés. Mais contrairement à un ETF, cela nécessite une action mensuelle de votre part."
    },
    {
      q: "Citadel Alpha est-il réglementé ?",
      a: "Citadel Alpha est un service d'information financière, pas un conseiller en investissement réglementé. Nos signaux sont fournis à titre informatif uniquement."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Questions fréquentes</h1>
        <p className="text-xl text-zinc-400">
          Tout ce que vous devez savoir sur Citadel Alpha
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
            <p className="text-zinc-300 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
