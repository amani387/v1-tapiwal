import type React from "react"
import {
  ExternalLink,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Github,
  Globe,
  Youtube,
  MessageCircle,
  Send,
} from "lucide-react"
import type { SocialLink, SocialPlatform } from "@/lib/types"

interface SocialLinkButtonProps {
  link: SocialLink
}

const platformConfig: Record<
  SocialPlatform,
  {
    icon: React.ReactNode
    label: string
    color: string
  }
> = {
  linkedin: {
    icon: <Linkedin className="h-5 w-5" />,
    label: "LinkedIn",
    color: "bg-[#0077B5]/10 text-[#0077B5]",
  },
  instagram: {
    icon: <Instagram className="h-5 w-5" />,
    label: "Instagram",
    color: "bg-[#E4405F]/10 text-[#E4405F]",
  },
  twitter: {
    icon: <Twitter className="h-5 w-5" />,
    label: "Twitter/X",
    color: "bg-[#1DA1F2]/10 text-[#1DA1F2]",
  },
  facebook: {
    icon: <Facebook className="h-5 w-5" />,
    label: "Facebook",
    color: "bg-[#1877F2]/10 text-[#1877F2]",
  },
  github: {
    icon: <Github className="h-5 w-5" />,
    label: "GitHub",
    color: "bg-foreground/10 text-foreground",
  },
  youtube: {
    icon: <Youtube className="h-5 w-5" />,
    label: "YouTube",
    color: "bg-[#FF0000]/10 text-[#FF0000]",
  },
  tiktok: {
    icon: <Globe className="h-5 w-5" />,
    label: "TikTok",
    color: "bg-foreground/10 text-foreground",
  },
  website: {
    icon: <Globe className="h-5 w-5" />,
    label: "Website",
    color: "bg-primary/10 text-primary",
  },
  whatsapp: {
    icon: <MessageCircle className="h-5 w-5" />,
    label: "WhatsApp",
    color: "bg-[#25D366]/10 text-[#25D366]",
  },
  telegram: {
    icon: <Send className="h-5 w-5" />,
    label: "Telegram",
    color: "bg-[#0088CC]/10 text-[#0088CC]",
  },
  other: {
    icon: <Globe className="h-5 w-5" />,
    label: "Link",
    color: "bg-primary/10 text-primary",
  },
}

export function SocialLinkButton({ link }: SocialLinkButtonProps) {
  const config = platformConfig[link.platform as SocialPlatform] || platformConfig.other

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.color}`}>{config.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{config.label}</p>
        <p className="truncate text-sm text-muted-foreground">{link.url}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </a>
  )
}
