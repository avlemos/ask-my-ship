interface LoadingProgressProps {
    message: string;
    progress: number;
    total: number;
    stage: string;
  }
  
  export default function LoadingProgress({ message, progress, total, stage }: LoadingProgressProps) {
    const done = Math.round(progress * total);
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-1">{message}</h3>
          <p className="text-sm text-gray-600">{stage}</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${(progress * 100).toFixed(1)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{done} MB</span>
          <span>{(progress * 100).toFixed(1)}%</span>
          <span>{total.toFixed(0)} MB</span>
        </div>
      </div>
    );
  }