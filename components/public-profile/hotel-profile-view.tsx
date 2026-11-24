"use client"

import { useState } from "react"
import { Heart, MapPin, Phone, Mail, Search } from "lucide-react"
import type { User } from "@/lib/types"

import Link from "next/link"
import { ArrowLeft, Crown, Shield } from "lucide-react"

interface HotelProfileViewProps {
  user: User
  hotelMenu: any
  categories: any[]
  menuItems: any[]
  viewerRole?: string | null
  isOwner?: boolean
}

export function HotelProfileView({ user, hotelMenu, categories, menuItems, viewerRole, isOwner }: HotelProfileViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0]?.id || null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = menuItems
    .filter((item) => !selectedCategory || item.category_id === selectedCategory)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())),
    )

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId)
    } else {
      newFavorites.add(itemId)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/3 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-1/3 w-80 h-80 bg-amber-500/2 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        {(viewerRole || isOwner) && (
          <div className="border-b border-amber-900/30 bg-slate-950/80 backdrop-blur-md px-4 py-3 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <Link
                href={
                  viewerRole === "super_admin"
                    ? "/admin/super"
                    : viewerRole === "admin"
                    ? "/admin"
                    : isOwner
                    ? "/dashboard/hotel"
                    : "/dashboard"
                }
                className="inline-flex items-center gap-2 text-xs font-medium text-amber-200/80 hover:text-amber-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {viewerRole === "super_admin"
                  ? "Back to Super Admin"
                  : viewerRole === "admin"
                  ? "Back to Admin"
                  : isOwner
                  ? "Back to Menu Editor"
                  : "Back to Dashboard"}
              </Link>
              <span className="text-[11px] text-amber-200/50">Hotel Menu Preview</span>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="min-h-[600px] flex flex-col items-center justify-center pt-12 px-4 text-center">
          <div className="mb-12 animate-fade-in">
            {hotelMenu?.logo_url && (
              <div className="mb-10">
                <img
                  src={hotelMenu.logo_url || "/placeholder.svg?height=140&width=140&query=hotel logo"}
                  alt={hotelMenu.hotel_name}
                  className="h-40 w-40 rounded-3xl object-cover shadow-2xl border border-amber-600/30 backdrop-blur-xl"
                />
              </div>
            )}

            <h1 className="text-7xl md:text-8xl font-serif font-light text-white mb-6 tracking-tight leading-tight">
              {hotelMenu?.hotel_name || user.full_name}
            </h1>

            {hotelMenu?.description && (
              <p className="text-xl md:text-2xl text-amber-100/50 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                {hotelMenu.description}
              </p>
            )}

            {user && (
              <div className="flex flex-wrap justify-center gap-8 text-sm text-amber-100/60 mb-12">
                {user.phone && (
                  <div className="flex items-center gap-3 hover:text-amber-100/80 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-light">{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-3 hover:text-amber-100/80 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-light">{user.location}</span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-3 hover:text-amber-100/80 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-light">{user.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-amber-600/30 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-amber-600 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 space-y-8">
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600/50" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-white/5 border border-amber-600/30 rounded-2xl text-white placeholder-amber-100/30 focus:outline-none focus:border-amber-600/60 focus:bg-white/10 transition-all font-light"
                />
              </div>

              {/* Category Filters */}
              {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-2.5 rounded-full font-light text-sm transition-all duration-300 ${
                      selectedCategory === null
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40"
                        : "bg-white/5 text-amber-100/70 border border-amber-600/20 hover:bg-white/10 hover:border-amber-600/40"
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-2.5 rounded-full font-light text-sm transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40"
                          : "bg-white/5 text-amber-100/70 border border-amber-600/20 hover:bg-white/10 hover:border-amber-600/40"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/8 to-white/3 border border-amber-600/20 hover:border-amber-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-600/20"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                      {item.image_url ? (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-amber-900/20 to-amber-700/10 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/10 rounded-2xl" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/40 group-hover:via-black/20 transition-all duration-300" />

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-amber-600 border border-white/20 hover:border-amber-600 transition-all duration-300 group-hover:scale-110"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(item.id)
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/70 group-hover:text-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      {/* Title */}
                      <div className="mb-4">
                        <h3 className="text-lg font-serif font-semibold text-white mb-3 line-clamp-2 group-hover:text-amber-100 transition-colors">
                          {item.name}
                        </h3>

                        {/* Description */}
                        {item.description && (
                          <p className="text-sm text-amber-100/50 line-clamp-3 leading-relaxed font-light">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-amber-600/20">
                        <span className="text-2xl font-serif font-light text-amber-400">${item.price.toFixed(2)}</span>
                        <button className="px-4 py-2 rounded-xl text-sm font-light bg-amber-600 text-white hover:bg-amber-500 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/40">
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-amber-100/50 font-light">No items found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
