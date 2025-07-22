import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for employees by complexity
const employeesByComplexity = {
  easy: [
    { id: 1, name: 'John Doe', email: 'john@company.com', lastActive: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', lastActive: '2024-01-14' },
    { id: 5, name: 'David Brown', email: 'david@company.com', lastActive: '2024-01-11' },
  ],
  medium: [
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', lastActive: '2024-01-13' },
    { id: 6, name: 'Emily Davis', email: 'emily@company.com', lastActive: '2024-01-10' },
  ],
  hard: [
    { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', lastActive: '2024-01-12' },
  ],
  'super-hard': []
};

const ComplexityEmployees = () => {
  const { complexity } = useParams();
  const navigate = useNavigate();

  const complexityMap: { [key: string]: string } = {
    easy: 'Easy',
    medium: 'Medium', 
    hard: 'Hard',
    'super-hard': 'Super Hard'
  };

  const employees = employeesByComplexity[complexity as keyof typeof employeesByComplexity] || [];

  const handleEmployeeClick = (employee: typeof employees[0]) => {
    navigate(`/employee-dashboard/${employee.id}`, { state: { employee } });
  };

  return (
    <div className="min-h-screen grainy-bg">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-vibe-glass-border">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="bg-background/50 border-vibe-glass-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-dancing text-vibe-warm-brown">
            {complexityMap[complexity || '']} Task Employees
          </h1>
        </div>
        <h2 
          className="text-2xl font-dancing text-vibe-warm-brown cursor-pointer hover:text-vibe-glow-orange transition-colors"
          onClick={() => navigate('/admin')}
        >
          Vibe
        </h2>
      </div>

      {/* Employee Grid */}
      <div className="p-6">
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: employee.id * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => handleEmployeeClick(employee)}
              >
                <Card className="glass-modal border-vibe-glass-border hover:border-vibe-glow-orange/50 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="font-dancing text-vibe-warm-brown text-xl">
                        {employee.name}
                      </span>
                      <Eye className="w-5 h-5 text-vibe-glow-orange" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-vibe-soft-orange">
                        {employee.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last active: {employee.lastActive}
                      </p>
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-vibe-soft-orange/20 text-vibe-warm-brown rounded-full text-sm">
                          {complexityMap[complexity || '']} Tasks
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="glass-modal border-vibe-glass-border max-w-md mx-auto">
              <CardContent className="p-8">
                <p className="text-vibe-warm-brown font-dancing text-xl mb-2">
                  No employees found
                </p>
                <p className="text-muted-foreground">
                  No employees have selected {complexityMap[complexity || '']} tasks today.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplexityEmployees;