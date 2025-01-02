export default function LoadingState({ message }: { message: string }) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p>{message}</p>
      </div>
    );
  }