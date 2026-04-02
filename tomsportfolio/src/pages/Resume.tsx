import {MainLayout} from '../components/Layout';
export default function Resume() {
    return (
        <MainLayout>
            <h1 className="headerSpacing">Toms Resume</h1>
            <p className="text-center max-w-xl mx-auto text-gray-600 mb-6">
                Here’s a quick look at my resume. You can preview it below or download a copy for later.
            </p>
            <a
                href={`./Thomas Evanko Resume - Sanitized.pdf`}
                download
                className="btn btn-primary mt-3 bluebtn-text"
                target="_blank"
                rel="noopener noreferrer"
            >
                📄 Download Resume
            </a>
            <br />
            <br />
            <div className="resume-preview d-none d-md-block">
                <iframe
                    src={`./Thomas Evanko Resume - Sanitized.pdf`}
                    width="1250px"
                    height="1000px"
                    title="Resume Preview"
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                    ></iframe>
            </div>
        </MainLayout>
    )
}
