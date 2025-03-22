import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import SchoolIcon from '@mui/icons-material/School';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const steps = [
    {
        title: "Step 1: Students Apply",
        description:
            "Students register, create profiles, and apply for grants by submitting necessary documents.",
        date: "Released on January 13th, 2022",
        additionalInfo:
            "Students provide the necessary documents to verify their eligibility for the grants.",
        icon: <SchoolIcon />,
        color: "#0369a1" // blue from the dashboard gradient
    },
    {
        title: "Step 2: Donors Donate",
        description:
            "Donors browse student profiles, verify details, and contribute to their educational journey.",
        date: "Released on February 5th, 2022",
        additionalInfo:
            "Donors can view detailed student profiles and decide to sponsor based on their goals.",
        icon: <VolunteerActivismIcon />,
        color: "#4f46e5" // indigo from the dashboard gradient
    },
    {
        title: "Step 3: Admins Manage",
        description:
            "Admins oversee applications, approve donations, and ensure transparency and accountability.",
        date: "Released on March 10th, 2022",
        additionalInfo:
            "Admins work to ensure every donation is directed to the appropriate student in need.",
        icon: <AdminPanelSettingsIcon />,
        color: "#7e22ce" // purple from the dashboard gradient
    },
];

export default function HowItWorks() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">How It Works</h2>
                    <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                        The Path to Educational Support
                    </h1>
                    <div className="mt-8 max-w-3xl mx-auto">
                        <p className="text-xl text-gray-500">
                            Our platform connects students with donors through a simple, transparent process.
                            Here's how we make educational dreams come true.
                        </p>
                    </div>
                </div>

                {/* Timeline Component */}
                <Timeline position={isMobile ? "right" : "alternate"}>
                    {steps.map((step, index) => (
                        <TimelineItem key={index}>
                            {!isMobile && (
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0' }}
                                    align="right"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {step.date}
                                </TimelineOppositeContent>
                            )}
                            <TimelineSeparator>
                                <TimelineConnector sx={{ bgcolor: index === 0 ? 'transparent' : steps[index-1].color, opacity: 0.7 }} />
                                <TimelineDot sx={{ 
                                    bgcolor: step.color, 
                                    boxShadow: `0 0 15px ${step.color}80`,
                                    p: 1
                                }}>
                                    {step.icon}
                                </TimelineDot>
                                <TimelineConnector sx={{ bgcolor: index === steps.length - 1 ? 'transparent' : step.color, opacity: 0.7 }} />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Paper elevation={3} sx={{ 
                                    p: 3, 
                                    borderRadius: 3,
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 6
                                    }
                                }}>
                                    <Typography variant="h6" component="div" sx={{ 
                                        color: step.color, 
                                        fontWeight: 'bold',
                                        mb: 1 
                                    }}>
                                        {step.title}
                                    </Typography>
                                    {isMobile && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                            {step.date}
                                        </Typography>
                                    )}
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {step.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.additionalInfo}
                                    </Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
                
                {/* Call to Action */}

            </div>
        </div>
    );
}