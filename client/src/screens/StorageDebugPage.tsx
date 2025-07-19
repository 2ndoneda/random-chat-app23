import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Database,
  Settings,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import StorageConnectionStatus from "../components/StorageConnectionStatus";
import { testFileUpload } from "../lib/connectionTest";
import {
  uploadProfileImage,
  uploadChatPhoto,
  uploadTempPhoto,
} from "../lib/storageUtils";
import { getUserId } from "../lib/userUtils";

export default function StorageDebugPage() {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTestingFile, setIsTestingFile] = useState(false);

  const addTestResult = (result: any) => {
    setTestResults((prev) => [...prev, { ...result, timestamp: new Date() }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const handleFileTest = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsTestingFile(true);

    try {
      // Test 1: Basic file upload test
      const basicResult = await testFileUpload(file);
      addTestResult({
        test: "Basic File Upload",
        ...basicResult,
      });

      // Test 2: Profile image upload
      const userId = getUserId();
      try {
        const profileResult = await uploadProfileImage(file, userId);
        addTestResult({
          test: "Profile Image Upload",
          isConnected: true,
          status: "success",
          message: `Profile image uploaded successfully`,
          details: { url: profileResult.url, path: profileResult.path },
        });
      } catch (error: any) {
        addTestResult({
          test: "Profile Image Upload",
          isConnected: false,
          status: "error",
          message: error.message,
          details: { error: error.message },
        });
      }

      // Test 3: Chat photo upload
      try {
        const chatResult = await uploadChatPhoto(file, "test-chat", userId);
        addTestResult({
          test: "Chat Photo Upload",
          isConnected: true,
          status: "success",
          message: `Chat photo uploaded successfully`,
          details: { url: chatResult.url, path: chatResult.path },
        });
      } catch (error: any) {
        addTestResult({
          test: "Chat Photo Upload",
          isConnected: false,
          status: "error",
          message: error.message,
          details: { error: error.message },
        });
      }

      // Test 4: Temporary photo upload
      try {
        const tempResult = await uploadTempPhoto(file, "test-session");
        addTestResult({
          test: "Temporary Photo Upload",
          isConnected: true,
          status: "success",
          message: `Temporary photo uploaded successfully`,
          details: {
            url: tempResult.url,
            path: tempResult.path,
            expiresAt: tempResult.expiresAt.toISOString(),
          },
        });
      } catch (error: any) {
        addTestResult({
          test: "Temporary Photo Upload",
          isConnected: false,
          status: "error",
          message: error.message,
          details: { error: error.message },
        });
      }
    } finally {
      setIsTestingFile(false);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-flamingo-50 via-blush-25 to-coral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-flamingo-600 via-blush-600 to-royal-600 text-white p-6 shadow-xl">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Storage Debug</h1>
              <p className="text-sm text-indigo-100">
                Firebase Storage Connection Test
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Connection Status */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Connection Status
          </h2>
          <StorageConnectionStatus showDetails={true} autoTest={true} />
        </div>

        {/* File Upload Tests */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload Tests
          </h2>

          <div className="space-y-3">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-medium text-gray-700 mb-3">
                Upload Test File
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Select an image to test all upload functions (profile, chat,
                temp)
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileTest}
                disabled={isTestingFile}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />

              {isTestingFile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testing uploads...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Test Results ({testResults.length})
              </h2>
              <Button
                onClick={clearResults}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>

            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl border p-4 ${
                    result.isConnected
                      ? "border-green-200 bg-green-50/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-medium text-gray-800">{result.test}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        result.isConnected
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {result.isConnected ? "Success" : "Failed"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{result.message}</p>

                  {result.details && (
                    <div className="bg-gray-50 rounded-lg p-2 text-xs">
                      <pre className="whitespace-pre-wrap text-gray-700">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2">How to Use</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check connection status at the top</li>
            <li>• Use "Test" buttons to verify connectivity</li>
            <li>• Upload an image to test all upload functions</li>
            <li>• View detailed results and error messages</li>
            <li>• If connection fails, check Firebase Console setup</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() =>
              window.open("https://console.firebase.google.com/", "_blank")
            }
            variant="outline"
            className="flex-1"
          >
            Firebase Console
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            className="flex-1"
          >
            Test in Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
