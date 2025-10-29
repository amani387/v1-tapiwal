"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface HotelProfileViewProps {
  user: User
  hotelMenu: any
  categories: any[]
  menuItems: any[]
}

export function HotelProfileView({ user, hotelMenu, categories, menuItems }: HotelProfileViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0]?.id || null)

  const filteredItems = selectedCategory ? menuItems.filter((item) => item.category_id === selectedCategory) : menuItems

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#073545] via-[#0a4a5c] to-[#eb300f]">
      <div className="container py-12">
        {/* Hotel Header */}
        <div className="mb-12 text-center text-white">
          {hotelMenu?.logo_url && (
            <img
              src={hotelMenu.logo_url || "/placeholder.svg"}
              alt={hotelMenu.hotel_name}
              className="mx-auto mb-6 h-24 w-24 rounded-full object-cover shadow-lg"
            />
          )}
          <h1 className="text-5xl font-bold">{hotelMenu?.hotel_name || user.full_name}</h1>
          {hotelMenu?.description && <p className="mt-2 text-lg text-white/80">{hotelMenu.description}</p>}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-white text-[#073545]" : "border-white text-white"}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-white/95 backdrop-blur">
              {item.image_url && (
                <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="h-48 w-full object-cover" />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>
              </CardHeader>
              {item.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-white">
            <p className="text-lg">No items available in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
