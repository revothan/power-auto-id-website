import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

type ContactPerson = {
  name: string
  number: string
}

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const contacts: ContactPerson[] = [
    { name: 'Alfi', number: '+62 811-8297-666' },
    { name: 'Audy', number: '+62 811 1260 1717' },
    { name: 'Jimmy', number: '+62 811-9288-855' }
  ]

  const handleContactClick = (number: string) => {
    // Clean the number by removing spaces and dashes
    const cleanNumber = number.replace(/\s|-/g, '')
    window.open(`https://wa.me/${cleanNumber}`, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Contact List */}
      {isOpen && (
        <div className="mb-4 flex w-60 flex-col rounded-lg bg-white p-4 shadow-lg transition-all duration-300 ease-in-out">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold">Hubungi Kami</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <IoMdClose size={18} />
            </button>
          </div>
          
          <div className="mt-2 flex flex-col space-y-2">
            {contacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleContactClick(contact.number)}
                className="flex items-center justify-between rounded-md bg-gray-100 p-3 text-left transition hover:bg-gray-200"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.number}</p>
                </div>
                <FaWhatsapp className="text-[#25D366] text-xl" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#20ba5a] md:h-16 md:w-16"
        aria-label="WhatsApp Contact"
      >
        {isOpen ? (
          <IoMdClose size={30} />
        ) : (
          <FaWhatsapp size={30} />
        )}
      </button>
    </div>
  )
}