package com.localizator.bus.implement;

import com.localizator.bus.dto.TraccarDevice;
import com.localizator.bus.entity.Device;
import com.localizator.bus.repository.DeviceRepository;
import com.localizator.bus.service.LocalizationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class DeviceRunnable implements Runnable {

    private Device device;

    private DeviceRepository deviceRepository;

    private SimpMessagingTemplate messagingTemplate;

    public DeviceRunnable(Device device, DeviceRepository deviceRepository, SimpMessagingTemplate messagingTemplate) {
        this.device = device;
        this.deviceRepository = deviceRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void run() {
        TraccarDevice traacarDevice = LocalizationService.createDevice(this.device);
        device.cloneTracar(traacarDevice);
        deviceRepository.saveAndFlush(device);
        messagingTemplate.convertAndSend("/buslocator/device", device);
    }
}
