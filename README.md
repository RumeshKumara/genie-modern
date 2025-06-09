interview-genie-bolt
{/* User Plan Info */}
              {isAuthenticated && user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 border rounded-lg bg-primary/5 border-primary/20"
                >
                  {/* <div className="flex items-center justify-between text-sm">
                    <span>Your Plan: <strong className="capitalize">{user.plan}</strong></span>
                    <span>Interviews: {user.interviewsThisMonth}/5</span>
                  </div> */}
                  {user.plan === 'free' && user.interviewsThisMonth >= 5 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Upgrade to Pro for unlimited interviews
                    </p>
                  )}
                </motion.div>
              )}