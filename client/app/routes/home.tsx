import { MessageSquare, Users, ArrowRight } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to ChatApp
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with friends through direct messages or join group
            conversations in rooms
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Direct Messages
              </CardTitle>
              <CardDescription>
                Chat privately with your friends and colleagues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <NavLink
                  to="/direct-message"
                  className="flex items-center gap-2"
                >
                  View Friends
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Rooms
              </CardTitle>
              <CardDescription>
                Join group conversations and collaborate with teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <NavLink to="/rooms" className="flex items-center gap-2">
                  Browse Rooms
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
