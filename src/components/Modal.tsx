import { ReactNode } from 'react';
import Modal from 'react-bootstrap/Modal';

interface ModalProps{
    showModal: boolean,
    toggleModal: ()=>void,
    header?: ReactNode,
    body?: ReactNode,
    footer?: ReactNode
}

export default function ModalPopup({showModal,toggleModal,header,body,footer}:ModalProps){
    return (<Modal show={showModal} onHide={()=>{toggleModal()}}>
    <Modal.Header closeButton>{header}</Modal.Header>
    <Modal.Body>
        {body}
    </Modal.Body>
    {footer?<Modal.Footer>
        {footer}
    </Modal.Footer>:<></>}
</Modal>)
}