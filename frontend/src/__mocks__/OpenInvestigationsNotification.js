import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem } from "@mui/material";

const MockOpenInvestigationsNotification = ({ open, investigations, onClose }) => {
    return (
        <div>
            <Button onClick={() => { }} variant="contained" color="primary" aria-label="notifications">
                Notifications
            </Button>

            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Open Investigations</DialogTitle>
                <DialogContent>
                    {investigations.length > 0 ? (
                        <List>
                            {investigations.map((investigation) => (
                                <ListItem key={investigation.id}>Investigation ID: {investigation.id}</ListItem>
                            ))}
                        </List>
                    ) : (
                        <p>No open investigations at the moment</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MockOpenInvestigationsNotification;
