import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface InterviewResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: {
    title: string;
    jobRole: string;
    score?: number;
    feedback?: string;
    strengths?: string[];
    improvements?: string[];
  } | null;
}

export default function InterviewResultModal({ isOpen, onClose, interview }: InterviewResultModalProps) {
  if (!interview) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed z-50 w-full max-w-2xl p-6 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg top-1/2 left-1/2 bg-card">
          <Dialog.Close className="absolute p-2 rounded-full top-4 right-4 hover:bg-muted">
            <X size={20} />
          </Dialog.Close>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{interview.title}</h2>
              <p className="text-muted-foreground">{interview.jobRole}</p>
            </div>

            <div className="p-4 rounded-lg bg-primary/10">
              <h3 className="text-xl font-semibold">Overall Score: {interview.score}%</h3>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Feedback Summary</h3>
              <p className="text-muted-foreground">{interview.feedback || "No feedback available."}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-green-500/10">
                <h4 className="font-semibold text-green-500">Strengths</h4>
                <ul className="mt-2 ml-4 list-disc">
                  {interview.strengths?.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  )) || <li>No strengths recorded</li>}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/10">
                <h4 className="font-semibold text-orange-500">Areas for Improvement</h4>
                <ul className="mt-2 ml-4 list-disc">
                  {interview.improvements?.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  )) || <li>No improvements recorded</li>}
                </ul>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
