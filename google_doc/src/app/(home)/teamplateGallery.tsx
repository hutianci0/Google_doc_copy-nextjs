'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
const templates = [
  {
    id: 'blank',
    label: 'Blank document',
    imgURL: '/blank-doc.svg',
    initialContent: `
<h1>Untitled</h1>
<p></p>
    `,
  },
  {
    id: 'bussiness',
    label: 'Business letter',
    imgURL: '/bussiness-letter.svg',
    initialContent: `
<div class="sender">
  [Your Name]<br>
  [Your Title]<br>
  [Company Name]<br>
  [Street Address]<br>
  [City, State/Province ZIP]<br>
  [Phone] · [Email] · [Website]
</div>

<p style="margin-top:1rem;">[Date: Month DD, YYYY]</p>

<div class="recipient">
  [Recipient Name]<br>
  [Recipient Title]<br>
  [Recipient Company]<br>
  [Street Address]<br>
  [City, State/Province ZIP]
</div>

<p><strong>Subject:</strong> [Concise Subject Line]</p>

<p>Dear [Recipient Name],</p>

<p>
  I am writing to [state your purpose in one sentence]. Provide brief context and
  the specific outcome you are seeking.
</p>

<ul>
  <li><strong>Background:</strong> Short context.</li>
  <li><strong>Value/Impact:</strong> Why this matters.</li>
  <li><strong>Request:</strong> What you want done.</li>
</ul>

<p>Thank you for your time and consideration.</p>

<p>Sincerely,<br><br>[Your Name]<br>[Your Title], [Company Name]</p>
    `,
  },
  {
    id: 'cv',
    label: 'Cover letter',
    imgURL: '/cover-letter.svg',
    initialContent: `
<div style="display:flex;justify-content:space-between;gap:1rem;">
  <div>
    <strong>[Your Name]</strong><br>
    [City, Country]<br>
    [Phone] · [Email] · [LinkedIn/GitHub]
  </div>
  <div style="text-align:right;">
    [Date: Month DD, YYYY]<br>
    [Hiring Manager Name]<br>
    [Company Name]<br>
    [Company Address Line 1]<br>
    [City, State/Province ZIP]
  </div>
</div>

<h2>Re: Application for [Job Title]</h2>

<p>Dear [Hiring Manager Name],</p>

<p>
  I’m excited to apply for the <strong>[Job Title]</strong> at <strong>[Company Name]</strong>.
  With [X]+ years of experience in [your field], I have delivered results such as
  [impact metric #1], [impact metric #2], and [impact metric #3].
</p>

<ul>
  <li><strong>Skill/Project A:</strong> What you did and its result.</li>
  <li><strong>Skill/Project B:</strong> Tools used and measurable outcome.</li>
  <li><strong>Skill/Project C:</strong> Teamwork/leadership achievement.</li>
</ul>

<p>
  I would welcome the opportunity to discuss how I can contribute to [team/org].
</p>

<p>Best regards,<br><br>[Your Name]</p>
    `,
  },
  {
    id: 'letter',
    label: 'Letter',
    imgURL: '/letter.svg',
    initialContent: `
<div style="text-align:right;">[Month DD, YYYY]</div>

<p>Dear [Name],</p>

<p>
  I hope this letter finds you well. I wanted to share a quick update on
  [topic/reason for writing]. It’s been [timeframe], and a lot has happened since
  we last spoke.
</p>

<p>[More details here...]</p>

<p class="closing">Warm regards,<br><br>[Your Name]</p>

<p>P.S. [Optional friendly note]</p>
    `,
  },
  {
    id: 'proposal',
    label: 'Proposal',
    imgURL: '/proposal.svg',
    initialContent: `
<h1>[Project Title]</h1>
<p><strong>Prepared by:</strong> [Your Company / Team]<br>
<strong>Date:</strong> [Month DD, YYYY]</p>

<h2>Executive Summary</h2>
<p>
  Summarize the problem, your proposed solution, and expected outcomes
  in 4–6 sentences.
</p>

<h2>Objectives & Success Criteria</h2>
<ul>
  <li><strong>Objective 1:</strong> [Describe + KPI]</li>
  <li><strong>Objective 2:</strong> [Describe + KPI]</li>
</ul>

<h2>Scope</h2>
<h3>In Scope</h3>
<ul><li>[Feature/Task A]</li><li>[Feature/Task B]</li></ul>
<h3>Out of Scope</h3>
<ul><li>[Excluded Item 1]</li></ul>

<h2>Timeline</h2>
<table>
  <tr><th>Phase</th><th>Start</th><th>End</th><th>Deliverables</th></tr>
  <tr><td>Discovery</td><td>[YYYY-MM-DD]</td><td>[YYYY-MM-DD]</td><td>[List]</td></tr>
  <tr><td>Design</td><td>[YYYY-MM-DD]</td><td>[YYYY-MM-DD]</td><td>[List]</td></tr>
</table>

<h2>Budget</h2>
<table>
  <tr><th>Item</th><th>Qty/Hours</th><th>Rate</th><th>Subtotal</th></tr>
  <tr><td>[Role/Item A]</td><td>[X]</td><td>[¤]</td><td>[¤]</td></tr>
  <tr><td><strong>Total</strong></td><td></td><td></td><td><strong>[¤]</strong></td></tr>
</table>

<h2>Risks & Mitigations</h2>
<ul>
  <li><strong>Risk:</strong> [Describe] — <em>Mitigation:</em> [Plan]</li>
</ul>

<h2>Acceptance Criteria</h2>
<ul>
  <li>[Criterion 1]</li>
  <li>[Criterion 2]</li>
</ul>

<h2>Sign-Off</h2>
<p>Client Representative: __________ Date: _______<br>
Vendor Representative: __________ Date: _______</p>
    `,
  },
]

export const TemplateGallary = () => {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const handleCreate = async (title: string, initialContent: string) => {
    setIsCreating(true)
    const id = await create({ title, initialContent })
    setIsCreating(false)
    router.push(`/documents/${id}`)
  }
  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen-2xl mx-auto px-16 py-6 flex flex-col justify-center  gap-y-4">
        <h3 className="font-medium">start a new document</h3>
        <Carousel className="-ml-4">
          <CarouselContent>
            {templates.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.3%] pl-4"
              >
                <div
                  className={cn(
                    'aspect-[3/4] flex flex-col justify-center gap-y-2.5',
                    isCreating && 'pointer-events-none opacity-50',
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() => handleCreate(item.label, item.initialContent)}
                    style={{
                      backgroundImage: `url(${item.imgURL})` || '',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                    className="size-full hover:bg-blue-50 rounded-sm border border-blue-50 transition flex flex-col items-center justify-center gap-4 bg-white"
                  ></button>
                  <p className="text-sm text-center truncate">{item.label}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
