import { createContext, useContext } from "react"
import type { CtasConfig } from "@/data/ctasSchema"
import { useCtas } from "@/hooks/useCtas"

export interface CtasContextValue {
  ctas: CtasConfig
  saveCtas: (config: CtasConfig) => Promise<{ ok: boolean; error?: string }>
}

const CtasContext = createContext<CtasContextValue | null>(null)

export function CtasProvider({ children }: { children: React.ReactNode }) {
  const { ctas, saveCtas } = useCtas()
  return (
    <CtasContext.Provider value={{ ctas, saveCtas }}>{children}</CtasContext.Provider>
  )
}

export function useCtasConfig(): CtasContextValue {
  const value = useContext(CtasContext)
  if (!value) throw new Error("useCtasConfig must be used within CtasProvider")
  return value
}
