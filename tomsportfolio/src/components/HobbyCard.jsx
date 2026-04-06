import { useState } from 'react';
import { Card, Text, Button, SimpleGrid, Image, Modal, Anchor } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function HobbyCard({ hobby }) {
    const [showMedia, setShowMedia] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const {
        title,
        icon,
        description,
        mediaUrl,
        mediaGallery,
        mediaType,
        showPuzzle,
        showPizza,
    } = hobby;

    const handleImageClick = (img) => {
        setSelectedImage(img);
        openModal();
    };

    return (
        <>
            <Card shadow="sm" radius="md" withBorder h="100%">
                <Card.Section withBorder inheritPadding py="xs">
                    <Text fw={600} size="lg">{icon} {title}</Text>
                </Card.Section>

                <Text mt="sm" c="dimmed" size="sm">{description}</Text>

                <Button
                    mt="md"
                    onClick={() => setShowMedia(prev => !prev)}
                >
                    {showMedia ? 'Hide' : 'Show'} {mediaType === 'video' ? 'Video' : 'Photo'}
                </Button>

                {showMedia && (
                    <div style={{ marginTop: '1rem' }}>
                        {showPuzzle && (
                            <div>
                                <Text fw={600} size="sm" mb="xs">🧠 Daily Puzzle</Text>
                                <Anchor
                                    href="https://www.chess.com/daily-chess-puzzle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button mb="sm">Solve Today's Puzzle</Button>
                                </Anchor>
                                <Image src={mediaUrl} alt={title} radius="md" />
                            </div>
                        )}

                        {showPizza && (
                            <SimpleGrid cols={2} spacing="sm">
                                {mediaGallery.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        alt={`Pizza ${i + 1}`}
                                        radius="sm"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleImageClick(img)}
                                    />
                                ))}
                            </SimpleGrid>
                        )}

                        {mediaType === 'video' && (
                            <video src={mediaUrl} controls style={{ width: '100%', borderRadius: '0.375rem' }} />
                        )}
                    </div>
                )}
            </Card>

            <Modal opened={modalOpened} onClose={closeModal} size="xl" centered padding={0}>
                {selectedImage && (
                    <Image src={selectedImage} alt="Enlarged view" radius="md" />
                )}
            </Modal>
        </>
    );
}

export default HobbyCard;
