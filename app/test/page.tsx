"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testAI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-ai")
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto voxel border-white/10">
        <CardHeader>
          <CardTitle>🧪 Scripton AI Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAI} disabled={loading} className="bg-scripton-cyan">
            {loading ? "Testing..." : "Test Claude AI Connection"}
          </Button>

          {result && (
            <pre className="bg-scripton-card p-4 rounded-lg text-sm overflow-auto max-h-96">
              <code>{result}</code>
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
