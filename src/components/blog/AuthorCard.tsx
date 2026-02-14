import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { ExternalLink, Github, Linkedin, Twitter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Author } from '../../../.velite'

interface AuthorCardProps {
  author: Author
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <OptimizedImage
              src={author.avatar}
              alt={`${author.name} profile picture`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
              sizes="64px"
            />
          </div>

          {/* Author Info */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{author.name}</h3>
            <p className="text-muted-foreground mb-4">{author.bio}</p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              {author.website && (
                <Button variant="outline" size="default" asChild>
                  <Link href={author.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Website
                  </Link>
                </Button>
              )}

              {author.social?.github && (
                <Button variant="outline" size="default" asChild>
                  <Link 
                    href={author.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-1" />
                    GitHub
                  </Link>
                </Button>
              )}

              {author.social?.linkedin && (
                <Button variant="outline" size="default" asChild>
                  <Link 
                    href={author.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </Link>
                </Button>
              )}

              {author.social?.twitter && (
                <Button variant="outline" size="default" asChild>
                  <Link 
                    href={author.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-4 h-4 mr-1" />
                    Twitter
                  </Link>
                </Button>
              )}

              {author.email && (
                <Button variant="outline" size="default" asChild>
                  <Link href={`mailto:${author.email}`}>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Email
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
