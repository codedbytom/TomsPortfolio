import { useState } from 'react';
import { Card, Text, Button, Collapse, Divider } from '@mantine/core';

function NightmareCard({ title, summary, solution, children }) {
    const [open, setOpen] = useState(false);

    return (
        <Card
            shadow="sm"
            radius="md"
            withBorder
            mb="md"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpen(prev => !prev)}
        >
            <Card.Section withBorder inheritPadding py="xs">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text fw={600} size="md">{title}</Text>
                    <Button
                        size="xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(prev => !prev);
                        }}
                    >
                        {open ? 'Collapse' : 'Expand'}
                    </Button>
                </div>
            </Card.Section>

            <Text mt="sm" size="sm" c="dimmed">{summary}</Text>

            <Collapse in={open}>
                <Divider my="sm" />
                {children}
                <Divider my="sm" />
                <Text size="sm"><strong>Solution:</strong> {solution}</Text>
            </Collapse>
        </Card>
    );
}

export default NightmareCard;
