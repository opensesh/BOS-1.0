import Accordion from '@components/common/Accordion'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

export default function Preview() {
  return (
    <div className="container-responsive py-8 space-y-6">
      <h2 className="text-2xl font-semibold">Component Preview</h2>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-medium">Buttons</h3>
          <div className="mt-3 flex gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium">Accordion</h3>
          <div className="mt-3">
            <Accordion title="Sample Accordion" defaultOpen>
              <div className="text-sm opacity-80">This content is lazily mounted when open.</div>
            </Accordion>
          </div>
        </Card>
      </section>
    </div>
  )
}


