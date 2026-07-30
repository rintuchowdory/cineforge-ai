import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Zap, ShoppingCart, Gift, Film } from 'lucide-react'
import { formatDate, formatCredits } from '@/lib/utils'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    credits: 100,
    features: ['3 video generations/day', '720p max', 'Text-to-video only', 'Community support'],
    current: false,
  },
  {
    name: 'Pro',
    price: 29,
    credits: 5000,
    features: ['Unlimited generations', '4K output', 'All input modes', 'A/B testing', 'Priority queue', 'API access'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    credits: 50000,
    features: ['Everything in Pro', 'Custom model fine-tuning', 'Dedicated support', 'SLA guarantee', 'Team workspaces'],
    current: false,
  },
]

export function Billing() {
  const { user, transactions } = useStore()

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your plan and credit usage.</p>
      </div>

      <Card className="glass border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold capitalize">{user.plan} Plan</h2>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-muted-foreground">Renews on August 1, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{formatCredits(user.credits)}</p>
              <p className="text-sm text-muted-foreground">credits remaining</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(user.credits / 5000) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatCredits(user.credits)} / 5,000 credits used this cycle
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`glass border-white/5 relative overflow-hidden ${
              plan.current ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : ''
            }`}
          >
            {plan.current && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                CURRENT
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium text-indigo-400">
                {formatCredits(plan.credits)} credits / month
              </p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? 'secondary' : plan.name === 'Enterprise' ? 'gradient' : 'outline'}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      tx.type === 'purchase'
                        ? 'bg-emerald-500/10'
                        : tx.type === 'bonus'
                        ? 'bg-amber-500/10'
                        : 'bg-destructive/10'
                    }`}
                  >
                    {tx.type === 'purchase' ? (
                      <ShoppingCart className="h-4 w-4 text-emerald-400" />
                    ) : tx.type === 'bonus' ? (
                      <Gift className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Film className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-muted-foreground'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
