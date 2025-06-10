import { useState } from "react";
import Form from "@/components/Form"
import Modal from "react-modal";

const ModalButton = ({ newExpense } : { newExpense : () => void}) => {

  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  //const modalRef = useRef<HTMLDialogElement>(null);
  Modal.setAppElement("#root");

    return (
        <div className="flex justify-center">
            <button
                className="btn btn-success"
                onClick={() => setIsOpen(true)}
            >
                + Add
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                className="modal-box absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-black"
            >
                <div className="">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setIsOpen(false)}
                >
                    ✕
                </button>
                <div>
                    <Form onFormSubmit={newExpense} />
                </div>
                </div>
            </Modal>
        </div>
    )
}
export default ModalButton;