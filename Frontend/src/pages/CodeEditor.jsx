import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CodeEditorModal from '../components/CodeEditorModal';
import { useAuth } from '../context/AuthContext';

const CodeEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

  // Keep the fallback question stable so the editor does not reset on rerenders.
  const question = useMemo(() => {
    if (location.state?.question) {
      return location.state.question;
    }

    return {
      docId,
      title: 'Coding Question',
      question: '',
    };
  }, [docId, location.state?.question]);
  const { user } = useAuth();

  return (
    <div className="w-full h-full">
      <CodeEditorModal
        open={true}
        onClose={() => navigate(-1)}
        question={question}
        user={user}
      />
    </div>
  );
};

export default CodeEditorPage;
