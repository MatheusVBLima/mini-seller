import { Suspense } from "react"
import { Header } from "./components/header"
import { DataContent } from "./components/data-content"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto p-4 sm:p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <DataContent />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
