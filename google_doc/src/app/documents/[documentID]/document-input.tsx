import { Input } from '@/components/ui/input'
import useDebounce from '@/utils/use-debounce'
import { useStatus } from '@liveblocks/react'
import { useMutation } from 'convex/react'
import { LoaderIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { BsCloudCheck, BsSlash } from 'react-icons/bs'
import { toast, Toaster } from 'sonner'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
export const DocumentInput = ({ title, id }: { title: string; id: Id<'documents'> }) => {
  const status = useStatus()
  const [value, setValue] = useState(title)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const mutate = useMutation(api.documents.UpdateTitleById)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    updateDebounce(e.target.value)
  }
  // immediately update input state, but only send update to server after 500ms of no more changes
  const updateDebounce = useDebounce(async (newValue: string) => {
    if (newValue === title) return
    setIsPending(true)
    await mutate({ id, title: newValue })
    toast.success('Document title updated')
    setIsPending(false)
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    await mutate({ id, title: value })
    toast.success('Document title updated')
    setIsPending(false)
  }

  const showLoader = isPending || status === 'connecting' || status === 'reconnecting'
  const showError = status === 'disconnected'

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form className="relative w-fit max-m-[50ch]" onSubmit={onSubmit}>
          <span className="invisible whitespace-pre px-1.5 text-lg">{value || ' '}</span>
          <Input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span className="text-lg px-1.5 cursor-pointer truncate" onClick={() => setIsEditing(true)}>
          {title ?? 'Untitled Doc'}
        </span>
      )}
      {showError && <BsSlash className="size-4" />}
      {!showError && !showLoader && <BsCloudCheck />}
      {showLoader && <LoaderIcon className="text-lg px-1.5 cursor-pointer truncate" />}
      <Toaster />
    </div>
  )
}
