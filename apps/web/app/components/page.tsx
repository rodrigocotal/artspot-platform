import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from '@/components/ui';

export default function ComponentsShowcase() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-display font-serif text-neutral-900">
            ArtSpot UI Components
          </h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            Luxury-themed component library for the premium art marketplace
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900">Buttons</h2>

          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Different button styles for various use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary */}
              <div className="space-y-3">
                <h3 className="text-heading-4 font-serif">Primary</h3>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="xl">Extra Large</Button>
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-3">
                <h3 className="text-heading-4 font-serif">Secondary</h3>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="secondary" loading>Loading</Button>
                  <Button variant="secondary" disabled>Disabled</Button>
                </div>
              </div>

              {/* Outline */}
              <div className="space-y-3">
                <h3 className="text-heading-4 font-serif">Outline</h3>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="outline">Outline</Button>
                  <Button variant="outline" loading>Loading</Button>
                  <Button variant="outline" disabled>Disabled</Button>
                </div>
              </div>

              {/* Ghost */}
              <div className="space-y-3">
                <h3 className="text-heading-4 font-serif">Ghost</h3>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="ghost" loading>Loading</Button>
                  <Button variant="ghost" disabled>Disabled</Button>
                </div>
              </div>

              {/* Link */}
              <div className="space-y-3">
                <h3 className="text-heading-4 font-serif">Link</h3>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="link">Link Style</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900">Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-neutral-600">
                  This is the card content area. It can contain any elements.
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Confirm</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Artwork Card</CardTitle>
                <CardDescription>Example artwork presentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-neutral-200 rounded-lg" />
                <div>
                  <p className="font-serif text-heading-4">Sunset Over Venice</p>
                  <p className="text-body text-neutral-600">Maria Rodriguez</p>
                  <p className="text-body-sm text-neutral-500 mt-2">
                    Oil on Canvas • 24" × 36"
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Inquire</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-neutral-600">
                  A minimalist card with just title and content.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900">Form Inputs</h2>

          <Card>
            <CardHeader>
              <CardTitle>Contact Form Example</CardTitle>
              <CardDescription>
                Form components with labels and validation states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="name" required>Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" required>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>

              {/* Error State */}
              <div className="space-y-2">
                <Label htmlFor="error-example" required>Email (Error State)</Label>
                <Input
                  id="error-example"
                  type="email"
                  placeholder="invalid@email"
                  error
                />
                <p className="text-body-sm text-error-600">
                  Please enter a valid email address
                </p>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your interest in this artwork..."
                  rows={4}
                />
              </div>

              {/* Disabled State */}
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input
                  id="disabled"
                  type="text"
                  placeholder="This input is disabled"
                  disabled
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Submit Inquiry</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Typography Examples */}
        <section className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900">Typography</h2>

          <Card>
            <CardContent className="space-y-6 pt-6">
              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Display Large</p>
                <h1 className="text-display-lg font-serif">Museum-Quality Art</h1>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Display</p>
                <h1 className="text-display font-serif">Featured Collection</h1>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Heading 1</p>
                <h1 className="text-heading-1 font-serif">Contemporary Paintings</h1>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Heading 2</p>
                <h2 className="text-heading-2 font-serif">New Arrivals</h2>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Heading 3</p>
                <h3 className="text-heading-3 font-serif">About the Artist</h3>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Heading 4</p>
                <h4 className="text-heading-4 font-serif">Artwork Details</h4>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Body Large</p>
                <p className="text-body-lg text-neutral-600">
                  This is body large text. Perfect for introductory paragraphs and important content.
                </p>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Body (Default)</p>
                <p className="text-body text-neutral-600">
                  This is standard body text. Used for paragraphs and general content throughout the site.
                </p>
              </div>

              <div>
                <p className="text-body-sm text-neutral-500 mb-2">Body Small</p>
                <p className="text-body-sm text-neutral-600">
                  This is small body text. Used for captions, labels, and secondary information.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
