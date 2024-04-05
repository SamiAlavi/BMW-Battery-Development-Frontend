import { useRef, useState } from 'react';
import { Dock } from 'primereact/dock';
import { Dialog } from 'primereact/dialog';
import { MenuItem } from 'primereact/menuitem';
import { FileUpload, FileUploadBeforeUploadEvent, FileUploadErrorEvent, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import './BottomNav.css'
import uploadImage from "./assets/upload-6699084.svg";
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
        

export default function BottomNav() {
    const [displayFileUploader, setDisplayFileUploader] = useState(false);
    const [type, setType] = useState<string>("capacity");
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);    
    const toast = useRef<Toast>(null);

    const MAX_FILE_SIZE = 3*1024*1024;

    const dockItems: MenuItem[] = [
        {
            label: 'Upload Files',
            icon: () => <img alt="Upload Files" src={uploadImage} width="100%" />,
            command: () => {
                setDisplayFileUploader(true);
            },
        },
    ];

    const radioButtons = [
        {
            label: "Capacity",
            value: "capacity",
        },
        {
            label: "Cycle",
            value: "cycle",
        }
    ]

    const updateType = (type: string) => {
        setType(type);
    }

    const showToastError = (message: string) => {
        toast?.current?.show({severity:'error', summary: 'Error', detail:message, life: 10_000});
    }

    const onBeforeUpload = (event: FileUploadBeforeUploadEvent) => {
        // Add custom data to the FormData object
        event.formData.append('type', type);
    };

    const onError = (e: FileUploadErrorEvent) => {
        showToastError(e.xhr.responseText)
    };

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        const files = e.files;

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: `${e.files.length} Files Uploaded` });
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(Math.max(totalSize - file.size, 0));
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const formatedValue = fileUploadRef?.current?.formatSize(totalSize) ?? '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue}</span>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-file mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Files Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-file', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };


    return (
        <div className="dock">
            <Toast ref={toast} position="bottom-center" />

            <Tooltip target=".p-dock-action" position="left" />

            <Dock
                model={dockItems}
                position="right"/>
            <Dialog
                visible={displayFileUploader}
                header={'Upload File'}
                style={{ width: '50vw', height: '35rem' }}
                onHide={() => setDisplayFileUploader(false)}
                blockScroll={true}>
                <div className="flex flex-wrap gap-3 mb-3">
                    {
                        radioButtons.map((btn) => {
                            return <>
                                <RadioButton inputId={btn.value} name={btn.label} value={btn.value} onChange={(e) => updateType(e.value)} checked={type === btn.value} />
                                <label htmlFor={btn.value} className="ml-2">{btn.label}</label>
                            </>
                        })
                    }
                </div>

                <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                <FileUpload ref={fileUploadRef} name="files" url="http://localhost:5000/upload" multiple accept="text/csv" maxFileSize={MAX_FILE_SIZE}
                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onError} onClear={onTemplateClear}
                    headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                    onBeforeUpload={onBeforeUpload}
                    />
            </Dialog>
        </div>
    );
}
  